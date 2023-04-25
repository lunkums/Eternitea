#version 300 es
precision mediump float;

const float MAX_SHININESS = 128.0;

struct Light {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform vec3 u_CameraPosition;
uniform Light u_Light;
uniform float u_Material[13];
uniform samplerCube u_Skybox;
uniform sampler2D u_Texture;

in vec3 v_WorldPosition;
in vec3 v_WorldNormal;

in vec3 v_Normal;
in vec2 v_TexCoords;
in vec3 v_Light;
in vec3 v_View;

out vec4 FragColor;

void main(void) {
    ////////////////
    // Unpack the material
    ////////////////
    vec3 ambient = vec3(u_Material[0], u_Material[1], u_Material[2]);
    vec3 diffuse = vec3(u_Material[3], u_Material[4], u_Material[5]);
    vec3 specular = vec3(u_Material[6], u_Material[7], u_Material[8]);
    vec3 emission = vec3(u_Material[9], u_Material[10], u_Material[11]);
    float shininess = u_Material[12];
    ////////////////

    ////////////////
    // Start calculating the lighting
    ////////////////
    vec3 normal = normalize(v_Normal);
    vec3 light = normalize(v_Light);
    vec3 view = normalize(v_View);

    vec3 ambientColor = u_Light.ambient * ambient;
    vec3 diffuseColor = u_Light.diffuse * diffuse * max(dot(normal, light), 0.0);
    vec3 specularColor = u_Light.specular * specular * pow(max(dot(reflect(-light, normal), view), 0.0), shininess);

    vec3 color = ambientColor + diffuseColor + specularColor + emission;
    //////////////

    //////////////
    // Start calculating the environment mapping
    //////////////
    vec3 worldNormal = normalize(v_WorldNormal);
    vec3 eyeToSurfaceDir = normalize(v_WorldPosition - u_CameraPosition);
    vec3 direction = reflect(eyeToSurfaceDir, worldNormal);
    vec3 skyboxColor = texture(u_Skybox, direction).rgb;
    //////////////

    vec3 result = mix(color, skyboxColor, shininess / MAX_SHININESS);
    result = clamp(result, vec3(0.0), color);
    FragColor = vec4(result, 1.0) * texture(u_Texture, v_TexCoords);
    
    // FragColor = vec4(color, 1.0); // Just the lighting
    // FragColor = vec4(skyboxColor, 1.0); // Just the environment mapping
}