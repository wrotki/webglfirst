<%@ page language="java" contentType="text/javascript; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

var OB = window.OtherBrane = window.OtherBrane || {};
OB.mediaPath ='${mediaUrl}';
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
            { name: "scene", location: OB.mediaPath + "/js/scene" }  ,
            { name: "app", location: OB.mediaPath + "/js/app" } 
        <c:forEach var="current" items="${keys}" >
           ,{ name: "${current}", location: OB.mediaPath + "/js/" + "${current}"} 
        </c:forEach>
        ],
        aliases: [
            ["ready", "dojo/domReady"]
        ]
    };
