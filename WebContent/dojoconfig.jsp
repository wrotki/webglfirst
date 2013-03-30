<%@ page language="java" contentType="text/javascript; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

var OB = window.OtherBrane = window.OtherBrane || {};
OB.absolutePath = window.location.pathname.replace(/\/[^/]+$/, "");
OB.s3Path = "http://otherbrane.s3-website-us-east-1.amazonaws.com/world1/area1";
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
            <%-- { name: "scene", location: OB.s3Path + "/js/scene"}  --%>
            { name: "scene", location: OB.absolutePath + "/js/scene"}  // Testing convenience - take from local server, not from S3
        <c:forEach var="current" items="${keys}" >
           <%-- ,{ name: "${current}", location: OB.s3Path + "/js/" + "${current}"} --%>
           ,{ name: "${current}", location: OB.absolutePath + "/js/" + "${current}"}  // Testing convenience - take from local server, not from S3
        </c:forEach>
        ],
        aliases: [
            ["ready", "dojo/domReady"]
        ]
    };
