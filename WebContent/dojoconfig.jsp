<%@ page language="java" contentType="text/javascript; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

var OB = window.OtherBrane = window.OtherBrane || {};
OB.absolutePath = window.location.pathname.replace(/\/[^/]+$/, ""); // Testing convenience - take from local server, not from S3
OB.s3Path = "http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1";
OB.bucketsPath = OB.s3Path;
OB.moduleList = [];

<c:forEach var="current" items="${keys}" >
   OB.moduleList.push("${current}");
</c:forEach>

    dojoConfig= {
        has: {
            "dojo-firebug": true,
            "dojo-debug-messages": true
        },
        parseOnLoad: false,
        async: true,
        dojoBlankHtmlUrl:'/blank.html',
        tlmSiblingOfDojo: false,
        packages: [
            { name: "scene", location: OB.bucketsPath + "/js/scene" }  
        <c:forEach var="current" items="${keys}" >
           ,{ name: "${current}", location: OB.bucketsPath + "/js/" + "${current}"} 
        </c:forEach>
        ],
        aliases: [
            ["ready", "dojo/domReady"]
        ]
    };
