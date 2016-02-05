precision mediump float;

#pragma glslify: coordToIndex = require(./components/coord-to-index)
#pragma glslify: packFloat = require(glsl-read-float)
#pragma glslify: map = require(./map-radiolarian)

uniform vec2 resolution;

uniform vec3 boundsA;
uniform vec3 boundsB;
uniform vec3 dims;
uniform float time;

vec3 vertDims = dims + vec3(1);
vec3 scale = (boundsB - boundsA) / dims;
vec3 shift = boundsA;

// float map(vec3 p) {
//     return length(p) - .5 + sin(time / 1000.) * .2;
// }

// void pR(inout vec2 p, float a) {
//     p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
// }

// float vmax(vec3 v) {
//     return max(max(v.x, v.y), v.z);
// }

// // Box: correct distance to corners
// float fBox(vec3 p, vec3 b) {
//     vec3 d = abs(p) - b;
//     return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
// }

// float map(vec3 p) {
//     // return length(p) - .5 + sin(time / 1000.) * .2;
//     // return length(p) - .9;
//     pR(p.xy, .5);
//     pR(p.zx, .2);
//     return fBox(p, vec3(.5));
// }

vec3 vertFromIndex(float index) {
    vec3 vert = vec3(0);
    vert.x = mod(index, vertDims.x);
    vert.y = mod(floor(index / vertDims.x), vertDims.y);
    vert.z = mod(floor(index / (vertDims.y * vertDims.x)), vertDims.z);
    return scale * vert + shift; 
}

void main() {

    float vertIndex = float(coordToIndex(gl_FragCoord.xy, resolution.xy));

    if (vertIndex >= vertDims.x * vertDims.y * vertDims.z) {
        gl_FragColor = vec4(1);
        return;
    }

    vec3 vert = vertFromIndex(vertIndex);
    float potential = map(vert);
    gl_FragColor = packFloat(potential);
}
