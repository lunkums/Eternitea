#version 300 es
precision highp float;

uniform samplerCube u_Skybox;
uniform mat4 u_ViewDirectionProjectionInverse;

in vec4 v_Position;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  vec4 t = u_ViewDirectionProjectionInverse * v_Position;
  outColor = texture(u_Skybox, normalize(t.xyz / t.w));
}