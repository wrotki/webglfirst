var CHART = CHART || {};
CHART.Shaders = {
    Pink: {
        'vertex': ["void main() {",
                    "gl_Position = projectionMatrix *",
                                  "modelViewMatrix *",
                                  "vec4(position,1.0);",
                   "}"].join("\n"),
                   
        'fragment': ["void main() {",
                     "gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);",
                   "}"].join("\n")
    },
    Lit: {
        'vertex': ["varying vec3 vNormal;",
                    "void main() {",
                    "vNormal = normal;",
                    "gl_Position = projectionMatrix *",
                                  "modelViewMatrix *",
                                  "vec4(position,1.0);",
                   "}"].join("\n"),
                   
        'fragment': ["varying vec3 vNormal;",
                     "void main() {",
                     "vec3 light = vec3(0.5,0.2,1.0);",
                     "light = normalize(light);",
                     "float dProd = max(0.0, dot(vNormal, light));",
                     "gl_FragColor = vec4(dProd, dProd, dProd, 1.0);",
                   "}"].join("\n")
    },
    LitAttribute: {
        'vertex': ["attribute float displacement;", 
                   "varying vec3 vNormal;",
                    "void main() {",
                    "vNormal = normal;",
                    "vec3 newPosition = position + normal * vec3(displacement);",
                    "gl_Position = projectionMatrix *",
                                  "modelViewMatrix *",
                                  "vec4(newPosition,1.0);",
                   "}"].join("\n"),
                   
        'fragment': ["varying vec3 vNormal;",
                     "void main() {",
                     "vec3 light = vec3(0.5,0.2,1.0);",
                     "light = normalize(light);",
                     "float dProd = max(0.0, dot(vNormal, light));",
                     "gl_FragColor = vec4(dProd, dProd, dProd, 1.0);",
                   "}"].join("\n")
    },
    ChartAttribute: {
        'vertex': ["attribute float displacement;", 
                    "attribute float gradient;", 
                   "varying vec3 vNormal;",
                   "varying vec3 vPos;",
                   "varying float vGradient;",
                    "void main() {",
                    "vNormal = normal;",
                    "vec3 newPosition = position;",
                    "newPosition.y = newPosition.y + displacement;",
                    "vPos = newPosition;",
                    "vGradient = gradient;",
                    "gl_Position = projectionMatrix *",
                                  "modelViewMatrix *",
                                  "vec4(newPosition,1.0);",
                   "}"].join("\n"),
                   
        'fragment': ["varying vec3 vNormal;",
                    "varying vec3 vPos;",
                   "varying float vGradient;",
                     "void main() {",
                     "vec3 light = vec3(0.5,0.2,1.0);",
                     "light = normalize(light);",
                     "//float dProd = max(0.0, dot(vNormal, light));",
                     "//float dProdX = max(0.0,vPos.y/100.0);//gl_FragCoord.x",
                     "gl_FragColor = vec4(vGradient/8.0, vGradient/1.5, vGradient/1.9, 1.0);",
                   "}"].join("\n")
    },
    LitAttributeAnimated: {
        'vertex': ["uniform float amplitude;",
                   "attribute float displacement;", 
                   "varying vec3 vNormal;",
                    "void main() {",
                    "vNormal = normal;",
                    "vec3 newPosition = position + normal * vec3(displacement * amplitude);",
                    "gl_Position = projectionMatrix *",
                                  "modelViewMatrix *",
                                  "vec4(newPosition,1.0);",
                   "}"].join("\n"),
                   
        'fragment': ["varying vec3 vNormal;",
                     "void main() {",
                     "vec3 light = vec3(0.5,0.2,1.0);",
                     "light = normalize(light);",
                     "float dProd = max(0.0, dot(vNormal, light));",
                     "gl_FragColor = vec4(dProd, dProd, dProd, 1.0);",
                   "}"].join("\n")
    }
};