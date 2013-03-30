<%--  
http://technologicaloddity.com/2011/10/04/render-and-capture-the-output-of-a-jsp-as-a-string/
--%>

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>

<%= request.getAttribute("series") %>

<%--    
[
    1,
    2,
    4,
    8,
    16,
    32,
    64,
    128,
    32,
    8,
    1
]
--%>