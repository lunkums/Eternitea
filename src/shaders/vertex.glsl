#version 300 es

uniform vec3 u_LightPosition;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

layout(location = 0) in vec4 a_Position;
layout(location = 1) in vec3 a_Normal;
layout(location = 2) in vec2 a_TexCoords;

out vec3 v_WorldPosition;
out vec3 v_WorldNormal;

out vec3 v_Normal;
out vec2 v_TexCoords;
out vec3 v_Light;
out vec3 v_View;

void main(void) {
    vec4 viewSpaceCoords = u_ViewMatrix * u_ModelMatrix * a_Position;
    vec4 lightCoords = u_ViewMatrix * vec4(u_LightPosition, 1.0);

    v_WorldPosition = (u_ModelMatrix * a_Position).xyz;
    v_WorldNormal = (u_ModelMatrix * vec4(a_Normal, 0.0)).xyz;
    
    v_Normal = mat3(u_ViewMatrix * u_ModelMatrix) * a_Normal;
    v_TexCoords = a_TexCoords;
    v_Light = lightCoords.xyz - viewSpaceCoords.xyz;
    v_View = -viewSpaceCoords.xyz;

    gl_Position = u_ProjectionMatrix * viewSpaceCoords;
}