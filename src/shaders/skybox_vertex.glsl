#version 300 es

layout(location = 0) in vec4 a_Position;

out vec4 v_Position;

void main() {
  v_Position = a_Position;
  gl_Position = a_Position;
  gl_Position.z = 1.0;
}