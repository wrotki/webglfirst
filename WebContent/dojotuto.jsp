<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!--
http://dojotoolkit.org/documentation/tutorials/1.9/themes_buttons_textboxes/
-->
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Tutorial: Hello Dojo!</title>
<link rel="stylesheet" href="demo.css" media="screen">
<link rel="stylesheet" href="style.css" media="screen">
<link rel="stylesheet"
	href="//ajax.googleapis.com/ajax/libs/dojo/1.9.1/dijit/themes/claro/claro.css"
	media="screen">
</head>
<body class="claro">
	<div id="appLayout" class="demoLayout"
		data-dojo-type="dijit/layout/BorderContainer"
		data-dojo-props="design: 'sidebar'">
		<div class="centerPanel" data-dojo-type="dijit/layout/StackContainer"
			data-dojo-props="region: 'center',id: 'contentStack'">
			<div data-dojo-type="dijit/layout/ContentPane" title="Group 1">
				<!-- http://philfreo.com/blog/how-to-allow-direct-file-uploads-from-javascript-to-amazon-s3-signed-by-python/
			
			https://github.com/elasticsales/s3upload-coffee-javascript/blob/master/s3upload.js
			
			"""
    Provide a temporary signature so that users can upload files directly from their
    browsers to our AWS S3 bucket.
    The authorization portion is taken from Example 3 on
    http://s3.amazonaws.com/doc/s3-developer-guide/RESTAuthentication.html
    """
			 -->
				<%
                 String policy_document =
"{\"expiration\": \"2013-08-13T00:00:00Z\"," +
 "\"conditions\": [ " +
   " {\"bucket\": \"otherbrane\"}, " +
   " [\"starts-with\", \"$key\", \"world1/\"]," +
    "{\"acl\": \"public-read\"}, " +
   " {\"success_action_redirect\": \"http://localhost/\"}, " +
   " [\"starts-with\", \"$Content-Type\",\"\"], " +
   " [\"content-length-range\", 0, 10485760] " +
 " ] " +
"}" ;

                 String policy = (new sun.misc.BASE64Encoder()).encode(
                 policy_document.getBytes("UTF-8")).replaceAll("\n","").replaceAll("\r","");

                 String aws_secret_key = "";

                 javax.crypto.Mac hmac = javax.crypto.Mac.getInstance("HmacSHA1");
                 hmac.init(new javax.crypto.spec.SecretKeySpec(
                 aws_secret_key.getBytes("UTF-8"), "HmacSHA1"));
                 String signature = (new sun.misc.BASE64Encoder()).encode(
                 hmac.doFinal(policy.getBytes("UTF-8")))
                    .replaceAll("\n", "");
                %>
				<form method="post" action="https://otherbrane.s3.amazonaws.com/" id="myForm"
					enctype="multipart/form-data">
					<fieldset>
						<legend>Upload model</legend>
						<input type="hidden" name="key" value="world1/area1/3d/${filename}Koala.jpg">
						<input type="hidden" name="AWSAccessKeyId"
							value="AKIAJ3ZLNGQLC3TNQPEQ"> 
						<input type="hidden"
							name="acl" value="public-read">
						 <input type="hidden"
							name="success_action_redirect" value="http://localhost/">
                        <!-- <input type="hidden" name="policy_document"
                            value="<%=policy_document%>">   -->
						<input type="hidden" name="policy"
							value="<%=policy%>"> 
						<input
							type="hidden" name="signature" value="<%=signature%>">
						<input type="hidden" name="Content-Type" value="image/jpeg">
						<!-- Include any additional input fields here -->

						File to upload to S3: 
						<!--  <input name="file" type="file"> <br> -->
						<input class="browseButton" name="file" multiple="true"
							type="file" dojoType="dojox.form.Uploader"
							label="Select Some Files" id="uploader" />
						 <input type="text"
							name="album" value="Summer Vacation" />
						 <input type="text"
							name="year" value="2011" /> 
						<input type="submit"
							label="Upload File to S3" dojoType="dijit.form.Button" />
					</fieldset>
				</form>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" title="Group Two">
				<h4>Group 2 Content</h4>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane"
				title="Long Tab Label for this One">
				<h4>Group 3 Content</h4>
			</div>
		</div>
		<div class="edgePanel" data-dojo-type="dijit/layout/ContentPane"
			data-dojo-props="region: 'top'">
			<div class="searchInputColumn">
				<div class="searchInputColumnInner">
					<input id="searchTerms" placeholder="search terms">
				</div>
			</div>
			<div class="searchButtonColumn">
				<button id="searchBtn">Search</button>
			</div>
		</div>
		<div class="edgePanel" data-dojo-type="dijit/layout/ContentPane"
			data-dojo-props="region: 'bottom'">
			<div data-dojo-type="dijit/layout/StackController"
				data-dojo-props="containerId:'contentStack'"></div>
		</div>
		<div id="leftCol" class="edgePanel"
			data-dojo-type="dijit/layout/ContentPane"
			data-dojo-props="region: 'left', splitter: true">Sidebar
			content (left)</div>
	</div>
	<!-- load dojo -->
	<script src="/WebGLFirst/Config"></script>
	<!-- gets a dojo config rendered via <script src="dojoconfig.jsp"></script>     -->
	<script src="//ajax.googleapis.com/ajax/libs/dojo/1.9.1/dojo/dojo.js"></script>
	<script>
		require([ "app/controller", "dojo/parser",
				"dijit/layout/BorderContainer", "dijit/layout/ContentPane",
				"dijit/layout/StackContainer", "dijit/layout/StackController",
				"app/controller", "dojo/domReady!" ],
				function(demoApp, parser) {
					parser.parse();
					demoApp.init();
				});
	</script>
</body>
</html>