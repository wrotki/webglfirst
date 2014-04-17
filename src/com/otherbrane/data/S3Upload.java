package com.otherbrane.data;

import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3EncryptionClient;
import com.amazonaws.services.s3.model.EncryptionMaterials;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.transfer.Download;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerConfiguration;
import com.amazonaws.services.s3.transfer.Upload;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;
import org.apache.hadoop.io.IOUtils;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;

import org.apache.log4j.Logger;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import static javax.xml.bind.DatatypeConverter.parseBase64Binary;

/**
 * Created by mborsa on 12/15/13.
 */
public class S3Upload
{
    private static final Logger sLogger = Logger.getLogger(S3Upload.class);
    // http://java.dzone.com/articles/hadoop-basics-creating
//    http://blog.cloudera.com/blog/2011/01/how-to-include-third-party-libraries-in-your-map-reduce-job/#!
    public static class S3EncryptingUploader extends Mapper<LongWritable, Text, LongWritable, Text>
    {
        private Text word = new Text();

        public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException
        {
            sLogger.info("Starting map()");
            try
            {
                List<String> tokens = new ArrayList<String>();
                StringTokenizer itr = new StringTokenizer(value.toString(), " ");
                while (itr.hasMoreTokens())
                {
                    tokens.add(itr.nextToken());
                }
                String path = tokens.get(tokens.size() - 1);
                sLogger.info(String.format("Processing key: %s",key.toString()));
                sLogger.info(String.format("Processing path: %s",path));
                if (path.startsWith("/"))
                {
                    Configuration conf = context.getConfiguration();
                    uploadSingleFile(path, conf);
                    word.set(path);
                    context.write(key, word);
                    sLogger.info(String.format("Done with path: %s",path));
                }
            } catch (IOException e)
            {
                sLogger.error("Mapper Exception", e);
                throw e;
            } catch (InterruptedException e)
            {
                sLogger.error("Mapper Exception", e);
                throw e;
            }
        }
    }

    public static class S3UploadReducerDoingNothingButLogging
        extends Reducer<LongWritable, Text, LongWritable, Text>
    {
        private Text result = new Text();

        public void reduce(LongWritable key, Iterable<Text> values,
                           Context context
        ) throws IOException, InterruptedException
        {
            String translations = "";
            for (Text val : values)
            {
                translations += "|" + val.toString();
            }
            result.set(translations);
            context.write(key, result);
        }
    }

    private static final long DEFAULT_UPLOAD_PART_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final int MULTIPART_UPLOAD_THRESHOLD = 10 * 1024 * 1024; // Multipart uploads will only be used for files greater than this size

    private static void uploadSingleFile(String inputFile, Configuration conf) throws IOException
    {
        try
        {
            sLogger.info(String.format("Copying: %s ...", inputFile));
            String awsId = conf.get(AWS_ID);
            String awsSecret = conf.get(AWS_SECRET);
            String awsCrypt = conf.get(AWS_CRYPT);
            sLogger.info("Getting S3 client");
            AmazonS3 s3Client = getAWSS3Client(awsId, awsSecret, awsCrypt);
            sLogger.info("Instantiating TransferManager");
            long partSize = DEFAULT_UPLOAD_PART_SIZE;
            TransferManager tm = new TransferManager(s3Client);
            sLogger.info("Configuring TransferManager");
            TransferManagerConfiguration tmConf = new TransferManagerConfiguration();
            tmConf.setMinimumUploadPartSize(partSize);
            tmConf.setMultipartUploadThreshold(MULTIPART_UPLOAD_THRESHOLD);
            tm.setConfiguration(tmConf);

            //Upload upload = tm.upload(bucket, key, new File(inputFile));

            sLogger.info("Examining HDFS input file");
            Path path = new Path(inputFile);
            FileSystem fs;
            fs = FileSystem.get(conf);
            FileStatus fileStatus = fs.getFileStatus(path);
            long fileLength = fileStatus.getLen();
            sLogger.info("Creating and setting up ObjectMetadata");
            ObjectMetadata metadata = new ObjectMetadata();
            sLogger.info("Still here");
            metadata.setContentType("text/plain");
            metadata.setContentLength(fileLength);
            sLogger.info("Opening HDFS input stream");
            FSDataInputStream inputStream = fs.open(path);
            String bucket = "search-experience-qi-bucket";
            String key = path.getName();
            sLogger.info("Starting upload");
            Upload upload = tm.upload(bucket, key, inputStream, metadata);

            try
            {
                sLogger.info("Waiting for completion");
                upload.waitForCompletion();
            } catch (AmazonClientException e)
            {
                sLogger.error("Upload error", e);
                throw new RuntimeException(String.format("unable to upload file [s3://%s/%s], upload was aborted", bucket, key), e);
            } catch (InterruptedException e)
            {
                sLogger.error("Upload error", e);
                throw new RuntimeException(String.format("unable to upload file [s3://%s/%s], upload was interrupted", bucket, key), e);
            } catch (Exception e)
            {
                sLogger.error("Upload error", e);
                throw new RuntimeException(String.format("unable to upload file [s3://%s/%s]", bucket, key), e);
            } finally
            {
                tm.shutdownNow();
            }
        } catch (IOException e)
        {
            sLogger.error("Upload error", e);
            throw e;
        }
    }

    private static void downloadSingleFile(String inputFile, Configuration conf) throws IOException
    {
        try
        {
            sLogger.info(String.format("Copying: %s ...", inputFile));
            String awsId = "";
            String awsSecret = "";
            String awsCrypt = "";
            sLogger.info("Getting S3 client");
            AmazonS3 s3Client = getAWSS3Client(awsId, awsSecret, awsCrypt);
            sLogger.info("Instantiating TransferManager");
            long partSize = DEFAULT_UPLOAD_PART_SIZE;
            TransferManager tm = new TransferManager(s3Client);
            sLogger.info("Configuring TransferManager");
            TransferManagerConfiguration tmConf = new TransferManagerConfiguration();
            tmConf.setMinimumUploadPartSize(partSize);
            tmConf.setMultipartUploadThreshold(MULTIPART_UPLOAD_THRESHOLD);
            tm.setConfiguration(tmConf);

            String bucket = "search-experience-qi-bucket";

            sLogger.info("Starting download");
//            Upload upload = tm.upload(bucket, key, inputStream, metadata);

            File file = new File("/home/hadoop/file");

            Download download = tm.download(bucket, inputFile, file);

            try
            {
                sLogger.info("Waiting for completion");
                download.waitForCompletion();
            } catch (AmazonClientException e)
            {
                sLogger.error("Upload error", e);
                throw new RuntimeException(String.format("unable to upload file [s3://%s/%s], upload was aborted", bucket, inputFile), e);
            } catch (InterruptedException e)
            {
                sLogger.error("Upload error", e);
                throw new RuntimeException(String.format("unable to upload file [s3://%s/%s], upload was interrupted", bucket, inputFile), e);
            } catch (Exception e)
            {
                sLogger.error("Upload error", e);
                throw new RuntimeException(String.format("unable to upload file [s3://%s/%s]", bucket, inputFile), e);
            } finally
            {
                tm.shutdownNow();
            }
        } catch (IOException e)
        {
            sLogger.error("Upload error", e);
            throw e;
        }
    }

    private static AmazonS3EncryptionClient getAWSS3Client(String awsKey, String awsSecret, String encryptionKey) throws FileNotFoundException, IOException
    {
        AWSCredentials aws;
        aws = new BasicAWSCredentials(awsKey, awsSecret);
        byte[] key = parseBase64Binary(encryptionKey);
        SecretKeySpec secretKeySpec = new SecretKeySpec(key, "AES");
        EncryptionMaterials crypt;
        crypt = new EncryptionMaterials(secretKeySpec);
        sLogger.info("Instantiating AmazonS3EncryptionClient");
        AmazonS3EncryptionClient client = new AmazonS3EncryptionClient(aws, crypt);
        return client;
    }

    private static void decryptFile(Configuration conf, String pathString, String encryptionKey) throws NoSuchPaddingException, NoSuchAlgorithmException, NoSuchProviderException, InvalidKeyException, IOException
    {
        FSDataInputStream inputStream = null;
        FSDataOutputStream outputStream = null;
        try
        {
            Path path = new Path(pathString);
            FileSystem fs;
            fs = FileSystem.get(conf);
            inputStream = fs.open(path);

            byte[] key = parseBase64Binary(encryptionKey);
            SecretKeySpec secretKeySpec = new SecretKeySpec(key, "AES");
//            Cipher decrypt = Cipher.getInstance("AES/ECB/PKCS5Padding", "SunJCE");
            Cipher decrypt = Cipher.getInstance("AES");
            decrypt.init(Cipher.DECRYPT_MODE, secretKeySpec);
            CipherInputStream cis;
            cis = new CipherInputStream(inputStream, decrypt);
            Path outPath = new Path(pathString + "_out");
            outputStream = fs.create(outPath);
            IOUtils.copyBytes(cis,outputStream,conf);

        } catch (IOException e)
        {
            sLogger.error("Error during decryption", e);
            throw e;
        } finally
        {
            if (inputStream != null)
            {
                inputStream.close();
            }
            if (outputStream != null)
            {
                outputStream.close();
            }
        }
    }

    static final String AWS_ID = "aws_id";
    static final String AWS_SECRET = "aws_secret";
    static final String AWS_CRYPT = "aws_crypt";

    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException, NoSuchPaddingException, NoSuchAlgorithmException, NoSuchProviderException, InvalidKeyException
    {
        sLogger.info("Hello, world!");
        try
        {
            Configuration conf = new Configuration();
            String[] extraArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
            conf.set(AWS_ID, extraArgs[0]);
            conf.set(AWS_SECRET, extraArgs[1]);
            conf.set(AWS_CRYPT, extraArgs[2]);
            conf.set("mapred.map.tasks","20");

            downloadSingleFile(extraArgs[3], conf);
            System.exit(0);

            System.setProperty("mapred.map.tasks", "20");
            sLogger.info("Dumping AWS S3 client");
            AmazonS3 s3Client = getAWSS3Client("", "", "");
            sLogger.info(String.format("S3client dumped: %s", s3Client.toString()));
            Job job = new Job(conf, "dictionary");
            job.setJarByClass(S3Upload.class);
            job.setMapperClass(S3EncryptingUploader.class);
            job.setReducerClass(S3UploadReducerDoingNothingButLogging.class);
            job.setOutputKeyClass(LongWritable.class);
            job.setOutputValueClass(Text.class);
            job.setInputFormatClass(TextInputFormat.class);
            FileInputFormat.addInputPath(job, new Path("input"));
            FileOutputFormat.setOutputPath(job, new Path("output"));
            System.exit(job.waitForCompletion(true) ? 0 : 1);
        } catch (IOException e)
        {
            sLogger.error("Upload error", e);
        } catch (IllegalStateException e)
        {
            sLogger.error("Upload error", e);
        } catch (InterruptedException e)
        {
            sLogger.error("Upload error", e);
        } catch (ClassNotFoundException e)
        {
            sLogger.error("Upload error", e);
        }

        sLogger.info("Bye, world, forever!");
    }
}
