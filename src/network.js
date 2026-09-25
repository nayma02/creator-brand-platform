// Network renderer adapted from the user-requested tryprofound.com reference.
// Preserves seed, topology, physics, depth blur, sprite atlas, and WebGL materials.
let a={seed:14842,netCount:92,netLoose:100,netClusters:7,netGrouping:86,netLinks:10,netSpread:100,netCenterDots:17,netCenterDepth:5,netTextDepth:50,netBlur:55,netDim:27,netGravity:13,netSpring:19,netRepulsion:70,netMotion:53,netSize:20,netIconMin:4.7,netIconMax:13.7,netDotSize:2,netFaviconRatio:43},n=(t,e=0,i=1)=>Math.max(e,Math.min(i,t)),l=t=>n((768-t)/288);function h(t,e){let i=Math.min(.37*t,.63*e),o=l(t);return{x:Math.max(1,t*(.44+.14*o)),y:Math.max(1,i+(Math.max(i,.55*e)-i)*o)}}function d(t){let e=t;return()=>(e=(1664525*e+0x3c6ef35f)%0x100000000)/0x100000000}let c=t=>.2+.8*t;class u{from=0;target=0;started=0;duration=0;sample(t){let e=this.duration?Math.max(0,Math.min(1,(t-this.started)/this.duration)):1;return this.from+(this.target-this.from)*(e*e*(3-2*e))}retarget(t,e){let i=+!!t;i!==this.target&&(this.from=this.sample(e),this.target=i,this.started=e,this.duration=t?140:320)}reset(){this.from=0,this.target=0,this.duration=0}}let m={intensity:.67,bloomIntensity:.21,bloomRadius:2.3,roughness:.39,curve:.17,dotScale:.71,dotLighting:.29,dustIntensity:3.91},f=(t,e,i)=>t+512+(e+512)*1024+(i+512)*1048576;class p{settings;nodes=[];links=[];centers=[];forces=new Float64Array(0);active=0;settling=!1;time=0;acc=0;cursor={x:0,y:0,active:!1};sourceOrder=[];linkLengths=new Float32Array(0);sourceToIndex=new Map;grid=new Map;solid=[];constructor(t){this.settings={...t},this.build(this.settings)}build(t){this.time=0,this.settling=!1;let e=d(t.seed+421),i=t.netClusters,o=24+Math.round(2.4*t.netCount),s=o+Math.round(.8*t.netLoose),r=Math.max(0,Math.min(s-o,Math.round(t.netCenterDots))),a=d(t.seed+4839),l=d(t.seed+9081);this.nodes=[],this.links=[],this.active=0,this.acc=0,this.centers=Array.from({length:i},(t,o)=>{let s=o/i*Math.PI*2;return[.61*Math.cos(s),.36*Math.sin(s),(e()-.5)*1.1]});for(let h=0;h<s;h++){let s=h%i,d=h>=o,c=d&&h<o+r,u=!d&&h>=i&&(Math.floor(h/i)+2*s)%4==3,m=h<i||d?-1:Math.floor(e()*Math.floor(h/i))*i+s;for(;m>=0&&this.nodes[m].satellite;)m=this.nodes[m].parent;let f=this.centers[s],p=[f[0]+(e()-.5)*.15,f[1]+(e()-.5)*.15,f[2]+(e()-.5)*.15];if(d){let i=e()*Math.PI*2,s=.52+.25*e(),a=Math.cos(i),n=Math.sin(i);p[0]=c?(e()-.5)*.68:Math.sign(a)*Math.abs(a)**.55*s,p[1]=c?(e()-.5)*.22:Math.sign(n)*Math.abs(n)**.55*s*.7,p[2]=c?t.netCenterDepth/100+(e()-.5)*.16:(e()-.5)*.8;let d=h-o-r;if(!c&&d%4==0){let t=Math.floor(d/4)%4;p[0]=(t%2==0?-1:1)*(.62+.1*l()),p[1]=(t<2?-1:1)*(.42+.1*l())}}if(u){let e=.5>a()?-1:1,o=this.centers[(s+e+i)%i],r=.35+.3*a(),l=.52+.86*a(),h=t.netGrouping/100;p[0]=(f[0]+(o[0]-f[0])*r)*l*h+(a()-.5)*.08;let d=n((l-.9)/.48);p[0]*=1+.2*d,p[1]=(f[1]+(o[1]-f[1])*r)*l*h+(a()-.5)*.08,p[1]*=1+.4*d,p[2]=(f[2]+(o[2]-f[2])*r)*h+(a()-.5)*.32}this.nodes.push({p,v:[0,0,0],anchor:[...p],group:s,parent:m,r:.009+.014*e(),visibility:0,loose:d,central:c,satellite:u,phase:e()*Math.PI*2}),m>=0&&this.links.push([m,h])}let h=t=>t<o?t/o:.025+(t-o)/(s-o)*.97,c=this.nodes.map((t,e)=>e).sort((t,e)=>h(t)-h(e)),u=new Map(c.map((t,e)=>[t,e]));this.sourceOrder=this.nodes,this.sourceToIndex=u,this.nodes=c.map(t=>{let e=this.nodes[t];return e.parent=u.get(e.parent)??-1,e}),this.rebuildLinks(),this.linkLengths=Float32Array.from(this.links,([t,e])=>{let i=this.nodes[t],o=this.nodes[e];return i.satellite||o.satellite?Math.max(.22,Math.hypot(...i.anchor.map((t,e)=>t-o.anchor[e]))):i.group===o.group?.075:.5}),this.forces=new Float64Array(3*s)}rebuildLinks(){let t=this.settings,e=t.netClusters,i=24+Math.round(2.4*t.netCount),o=this.sourceOrder;for(let[t,e]of(this.links=[],this.nodes.entries()))e.parent>=0&&this.links.push([e.parent,t]);let s=d(t.seed+722),r=new Set(this.links.map(([t,e])=>`${t}:${e}`)),a=(t,e)=>{let i=this.sourceToIndex.get(t),o=this.sourceToIndex.get(e);if(void 0===i||void 0===o||i===o)return;let s=Math.min(i,o),a=Math.max(i,o),n=`${s}:${a}`;r.has(n)||(r.add(n),this.links.push([s,a]))};for(let t=e;t<i;t++).45>s()&&a(Math.floor(s()*Math.floor(t/e))*e+t%e,t);for(let e=1;e<i;e++){let i=[];for(let t=0;t<e;t++)o[t].group!==o[e].group&&i.push(t);let r=t.netLinks/100*3;for(let t=0;t<Math.ceil(r);t++)i.length&&s()<Math.min(1,r-t)&&a(i[Math.floor(s()*i.length)],e)}}setPointer(t,e,i){if(this.cursor.active=t.active&&e>0&&i>0,!this.cursor.active)return;let{x:o,y:s}=h(e,i),r=1+this.settings.netSpread/100*.65;this.cursor.x=t.x*e/2/(o*r),this.cursor.y=-t.y*i/2/(s*r)}step(t,e){let i=this.active,o=this.forces,s=e.netSpring/100,r=e.netGravity/100,a=e.netRepulsion/100,l=e.netGrouping/100,h=(.15+.7*r)*(1-l)+(2.4+2*r)*l,d=Math.exp(-(3.5*t)),c=1+(e.netSize??35)/100*1.8;o.fill(0,0,3*i),this.time+=t;let u=this.solid;u.length=0;for(let t=0;t<i;t++){let i=this.nodes[t],s=i.loose||i.satellite,r=s?i.anchor:this.centers[i.group],n=i.loose?.5:1.4,d=s?n:h,m=s?1:l;for(let s=0;s<3;s++)o[3*t+s]+=(r[s]*m-i.p[s])*d+Math.sin(.6*this.time+i.phase+s)*e.netMotion*4e-4;if(this.cursor.active){let e=2.8/(2.8-i.p[2]),s=i.p[0]-this.cursor.x/e,r=i.p[1]-this.cursor.y/e,a=Math.hypot(s,r)||.001,n=.09*Math.exp(-(a*a)/.018);o[3*t]+=s/a*n,o[3*t+1]+=r/a*n}if(!i.loose){for(let e=0;e<u.length;e++){let s=u[e],r=this.nodes[s],n=i.p[0]-r.p[0],l=i.p[1]-r.p[1],h=i.p[2]-r.p[2],d=n*n+l*l+h*h,m=Math.max(.002,Math.sqrt(d)),f=i.satellite||r.satellite?.25:1,p=(28*Math.max(0,(i.r+r.r)*c-m)+(7e-5+6e-4*a)*f/(d+.004))*Math.min(i.visibility,r.visibility)/m;o[3*t]+=n*p,o[3*t+1]+=l*p,o[3*t+2]+=h*p,o[3*s]-=n*p,o[3*s+1]-=l*p,o[3*s+2]-=h*p}u.push(t)}}for(let t=0;t<this.links.length;t++){let[e,r]=this.links[t];if(r>=i)continue;let a=this.nodes[e].p,n=this.nodes[r].p,h=n[0]-a[0],d=n[1]-a[1],c=n[2]-a[2],u=Math.hypot(h,d,c)||.001,m=this.nodes[e].group===this.nodes[r].group,f=this.nodes[e].satellite||this.nodes[r].satellite,p=m?1:1-.75*l,g=f?.22:p,v=(u-this.linkLengths[t])*(.3+2*s)/u*g*Math.min(this.nodes[e].visibility,this.nodes[r].visibility);o[3*e]+=h*v,o[3*e+1]+=d*v,o[3*e+2]+=c*v,o[3*r]-=h*v,o[3*r+1]-=d*v,o[3*r+2]-=c*v}for(let e=0;e<i;e++){let i=this.nodes[e];for(let s=0;s<3;s++)i.v[s]=(i.v[s]+o[3*e+s]*t)*d,i.p[s]=n(i.p[s]+i.v[s]*t,-2,2)}this.constrain(c)}constrain(t){let e=.05*t*1.035,i=this.grid;for(let o=0;o<3;o++){i.clear();for(let o=0;o<this.active;o++){let s=this.nodes[o],r=Math.floor(s.p[0]/e),a=Math.floor(s.p[1]/e),n=Math.floor(s.p[2]/e);for(let e=r-1;e<=r+1;e++)for(let o=a-1;o<=a+1;o++)for(let r=n-1;r<=n+1;r++){let a=i.get(f(e,o,r));if(a)for(let e of a){let i=this.nodes[e],o=s.p[0]-i.p[0],r=s.p[1]-i.p[1],a=s.p[2]-i.p[2],n=Math.hypot(o,r,a),l=(s.r*s.visibility+i.r*i.visibility)*t*1.035;if(n>=l)continue;n<1e-5&&(o=1e-5,n=1e-5);let h=i.visibility/(s.visibility+i.visibility),d=1-h,c=(l-n)/n;s.p[0]+=o*c*h,i.p[0]-=o*c*d,s.p[1]+=r*c*h,i.p[1]-=r*c*d,s.p[2]+=a*c*h,i.p[2]-=a*c*d;let u=((s.v[0]-i.v[0])*o+(s.v[1]-i.v[1])*r+(s.v[2]-i.v[2])*a)/n;if(u<0){let t=u/n;s.v[0]-=t*o*h,i.v[0]+=t*o*d,s.v[1]-=t*r*h,i.v[1]+=t*r*d,s.v[2]-=t*a*h,i.v[2]+=t*a*d}}}let l=f(Math.floor(s.p[0]/e),Math.floor(s.p[1]/e),Math.floor(s.p[2]/e)),h=i.get(l);h?h.push(o):i.set(l,[o])}}}update(t,e,i,o=1){let s=this.settings,r=Math.min(this.nodes.length,Math.max(0,Math.round(e**1.35*this.nodes.length))),a=this.active<r;this.active=Math.max(this.active,r),this.settling=!1;for(let e=0;e<this.active;e++){let o=this.nodes[e],s=+(e<r);o.visibility=function(t,e,i,o=!1){let s=+!!e;if(o)return s;let r=s+(t-s)*Math.exp(-Math.max(0,i)*(e?6:28));return .003>Math.abs(r-s)?s:r}(o.visibility,1===s,t,i),o.visibility!==s&&(this.settling=!0)}if(!i&&o>0)for(this.acc+=Math.min(t,.05);this.acc>=1/60;)this.step(1/60*n(o),s),this.acc-=1/60;else this.acc=0,a&&i&&this.constrain(1+(s.netSize??35)/100*1.8);for(;this.active>r&&this.nodes[this.active-1].visibility<.002;)this.active--}}const g={PROBLEM_STATEMENT_ATLAS_URL:"/assets/network-atlas.png"};let v=["reddit","youtube","quora","wikipedia","x","linkedin","medium","stackoverflow","substack","wikipedia","g2","glassdoor","trustpilot","tripadvisor","yelp","facebook","instagram","pinterest","github","twitch","tumblr","vimeo","linkedin","spotify","dribbble","behance","blogger","stackexchange","wordpress","hackernews","foursquare","snapchat","tripadvisor","github","disqus","deviantart","telegram","steam","techcrunch"],x=[0,.12,.3,.6,1,1.5,2.2,3,4,6],y=[0,.12,.3,.6,1,1.5,2.2,3,4,6,8,12,16,24,32],b=Math.floor(2048/96);function M(t,e,i){let o=i?16:2,s=t%b*96+2,r=96*Math.floor(t/b)+2;return{u0:(s+.5)/2048,v0:(r+.5)/2048,u1:(s+92-.5)/2048,v1:(r+92-.5)/2048,size:Math.ceil(((i?2.2*o:o)+e*o*3+2)*2),radius:o}}let w=y.map((t,e)=>M(e,t,!1)),R=v.map((t,e)=>x.map((t,i)=>M(y.length+e*x.length+i,t,!0)));class P{atlas=new Image;version=0;disposed=!1;ready=!1;loading;cancelLoad;load(){return this.disposed?Promise.resolve():(this.loading??=this.loadAtlas(),this.loading)}loadAtlas(){return new Promise((t,e)=>{let i=!1,o=o=>{i||(i=!0,this.atlas.onload=null,this.atlas.onerror=null,this.cancelLoad=void 0,o&&!this.disposed?e(o):t())};this.cancelLoad=()=>o(),this.atlas.decoding="async",this.atlas.onload=async()=>{if(!this.disposed&&!i)try{if(await this.atlas.decode(),this.disposed||i)return;if(2048!==this.atlas.naturalWidth||2048!==this.atlas.naturalHeight)return void o(Error("Unexpected problem-statement atlas dimensions."));this.ready=!0,this.version+=1,o()}catch{o(Error("Unable to decode the problem-statement atlas."))}},this.atlas.onerror=()=>o(Error("Unable to load the problem-statement atlas.")),this.atlas.src=g.PROBLEM_STATEMENT_ATLAS_URL})}sample(t,e,i,o){if(!this.ready||this.disposed||e<=0||!Number.isFinite(t)||!Number.isFinite(e)||!Number.isFinite(i))return;let s=(Math.trunc(t)%v.length+v.length)%v.length,r=o?R[s]:w,a=o?x:y,n=Math.max(0,i)/e,l=0;for(;l<a.length-1&&a[l]<n;)l+=1;let h=l>0?l-1:0,d=r[h],c=r[l],u=a[h],m=a[l];return{lower:d,upper:c,mix:m===u?0:Math.min(1,(n-u)/(m-u)),radius:e,isIcon:o}}dispose(){this.disposed||(this.disposed=!0,this.ready=!1,this.cancelLoad?.(),this.atlas.removeAttribute("src"))}}let A=`#version 300 es
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float power;
uniform float pixelRatio;
out vec3 moteColor;
out float moteOpacity;
out float moteSoftness;

float dustRandom(float seed) {
  return fract(sin(seed * 127.1 + 311.7) * 43758.5453);
}

void main() {
  float seed = float(gl_VertexID) + 1.0;
  float depth = dustRandom(seed + 17.0);
  float perspective = mix(0.70, 1.20, depth);
  float phase = dustRandom(seed + 41.0) * 6.283185;
  float drift = mix(0.65, 1.25, dustRandom(seed + 107.0));
  vec2 origin = vec2(dustRandom(seed), dustRandom(seed + 89.0));
  vec2 heading = normalize(vec2(dustRandom(seed + 23.0) - 0.5, -0.35 - dustRandom(seed + 53.0) * 0.65));
  vec2 velocity = heading * mix(6.0, 10.0, dustRandom(seed + 151.0));
  vec2 sway = vec2(
    sin(time * 0.43 * drift + phase) + sin(time * 0.17 + phase * 1.7) * 0.35,
    cos(time * 0.37 * drift + phase) + sin(time * 0.23 + phase * 1.3) * 0.4
  ) * mix(8.0, 17.0, depth);
  vec2 position = fract(origin + (velocity * time + sway) / max(resolution, vec2(1.0)));

  // Wrapping happens only after each mote has faded at the section boundary.
  vec2 edge = smoothstep(vec2(0.0), vec2(0.06), position)
    * (1.0 - smoothstep(vec2(0.94), vec2(1.0), position));
  vec2 fromText = (position - 0.5) / vec2(0.30, 0.23);
  float textClearance = 1.0 - exp(-dot(fromText, fromText) * 1.1) * 0.82;
  float turn = 0.78 + sin(time * 0.4 + phase) * 0.22;
  float warmth = dustRandom(seed + 199.0) * 0.7;
  moteColor = mix(vec3(0.78, 0.84, 0.94), vec3(1.0, 0.96, 0.90), warmth);
  moteOpacity = mix(0.07, 0.17, depth) * turn * textClearance * edge.x * edge.y * power;
  moteSoftness = mix(6.0, 3.8, depth);
  float grainSize = mix(0.85, 1.15, dustRandom(seed + 131.0));
  gl_PointSize = 6.3 * grainSize * perspective * pixelRatio;
  gl_Position = vec4(position.x * 2.0 - 1.0, 1.0 - position.y * 2.0, 0.0, 1.0);
}
`,L=`#version 300 es
precision highp float;
in vec3 moteColor;
in float moteOpacity;
in float moteSoftness;
out vec4 pixel;

void main() {
  vec2 point = gl_PointCoord * 2.0 - 1.0;
  float radiusSquared = dot(point, point);
  float coverage = exp(-radiusSquared * moteSoftness) * (1.0 - smoothstep(0.5, 1.0, radiusSquared));
  float alpha = coverage * clamp(moteOpacity, 0.0, 1.0);
  // ProblemStatement uses premultiplied source-over blending, unlike the hero's additive pass.
  pixel = vec4(moteColor * alpha, alpha);
}
`,E=`#version 300 es
precision highp float;
uniform sampler2D artwork;
uniform float materialStrength;
uniform float dotLightStrength;
uniform float roughness;
uniform vec4 cursorLight;
in vec2 local;
in vec2 screenPoint;
flat in vec4 lowerBounds;
flat in vec4 upperBounds;
flat in vec4 blendParameters;
flat in vec4 color;
// Quad half-size, glyph radius, emission strength, and whether the sprite is an icon.
flat in vec4 surface;
out vec4 pixel;

vec4 kernel(vec4 bounds, float scale, vec2 position) {
  vec2 point = 0.5 + position * (0.5 * scale);
  if (any(lessThan(point, vec2(0.0))) || any(greaterThan(point, vec2(1.0)))) return vec4(0.0);
  return texture(artwork, mix(bounds.xy, bounds.zw, point));
}

vec4 sampleArtwork(vec2 position) {
  return mix(
    kernel(lowerBounds, blendParameters.x, position),
    kernel(upperBounds, blendParameters.y, position),
    blendParameters.z
  );
}

float energy(vec3 value) {
  return max(value.r, max(value.g, value.b));
}

void main() {
  vec4 source = sampleArtwork(local);
  // Icons return from 92% to their normal brightness, without changing their opacity.
  float proximity = (1.0 - smoothstep(0.0, cursorLight.z, length(screenPoint - cursorLight.xy))) * cursorLight.w;
  float hoverBrightness = mix(1.0, mix(0.92, 1.0, clamp(proximity, 0.0, 1.0)), step(0.5, surface.w));
  vec3 base = source.rgb * color.rgb * blendParameters.w;

  if (surface.z > 0.0) {
    // Black connection masks must not become visible rings in the luminous pass.
    vec3 emission = max(base * color.a * surface.z, vec3(0.0));
    emission /= max(1.0, energy(emission));
    emission *= hoverBrightness;
    pixel = vec4(emission, energy(emission));
    return;
  }

  pixel = vec4(min(base, vec3(source.a)) * hoverBrightness, source.a) * color.a;
  // Keep simple points almost flat; this does not attenuate their separate emission pass.
  float strength = clamp(materialStrength, 0.0, 2.0)
    * mix(clamp(dotLightStrength, 0.0, 0.3), 1.0, step(0.5, surface.w));
  if (strength <= 0.0 || energy(source.rgb) < 0.001) return;

  float radius = max(surface.y, 0.5);
  float sampleDistance = clamp(radius * 0.085, 0.65, 1.5);
  vec2 offset = vec2(sampleDistance / max(surface.x, 0.5), 0.0);
  float left = energy(sampleArtwork(local - offset.xy).rgb);
  float right = energy(sampleArtwork(local + offset.xy).rgb);
  float top = energy(sampleArtwork(local - offset.yx).rgb);
  float bottom = energy(sampleArtwork(local + offset.yx).rgb);
  vec2 gradient = vec2(left - right, top - bottom);
  float edge = length(gradient);

  // Use RGB, not atlas alpha: icons include a black radial mask underneath the glyph.
  float coverage = energy(source.rgb);
  vec2 convex = local * surface.x / radius;
  float distanceSquared = dot(convex, convex);
  convex /= max(1.0, sqrt(distanceSquared));
  float face = sqrt(max(0.05, 1.0 - min(distanceSquared, 0.95)));
  vec3 normal = normalize(vec3(convex * 0.6 + gradient * 2.5, face));
  vec3 light = normalize(vec3(-0.38, -0.58, 1.0));
  float matte = clamp(roughness, 0.0, 1.0);
  // Defocused kernels have a weak RGB gradient; avoid relighting them with a sharp edge.
  float definition = smoothstep(0.015, 0.38, edge + coverage * 0.16);
  vec3 highlightTint = mix(source.rgb / max(coverage, 0.001), vec3(1.0), 0.45);
  vec3 lit;

  // A grazing highlight follows the actual silhouette rather than a circular container.
  vec2 grazingDirection = light.xy / max(length(light.xy), 0.0001);
  float facingLight = max(dot(normal.xy, grazingDirection), 0.0);
  float bevel = smoothstep(0.015, 0.55, edge);
  float grazing = pow(1.0 - max(normal.z, 0.0), mix(3.8, 0.9, matte));
  float rim = (bevel * 0.75 + grazing * 0.22) * (0.25 + facingLight * 0.75);
  lit = base * (1.0 - strength * 0.05);
  lit += highlightTint * coverage * rim * strength * blendParameters.w * definition * mix(1.2, 0.6, matte);

  // Keep the shader output premultiplied after adding illumination.
  pixel = vec4(min(max(lit, vec3(0.0)), vec3(source.a)) * hoverBrightness, source.a) * color.a;
}`,C=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),S=`#version 300 es
void main() {
  vec2 point = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(point * 2.0 - 1.0, 0.0, 1.0);
}`,T=`#version 300 es
precision highp float;
uniform vec2 resolution;
uniform float pixelRatio;
uniform vec4 textEllipse;
out vec4 pixel;
void main() {
  vec2 point = vec2(gl_FragCoord.x / pixelRatio, resolution.y - gl_FragCoord.y / pixelRatio);
  float radius = length((point - textEllipse.xy) / max(textEllipse.zw, vec2(1.0)));
  // Keep the center readable and let the surrounding network return gradually.
  float inner = smoothstep(0.0, 0.55, radius);
  float outer = smoothstep(0.55, 1.0, radius);
  float opacity = mix(0.97, 0.65, inner) * (1.0 - outer);
  pixel = vec4(0.0, 0.0, 0.0, opacity);
}`,U=`#version 300 es
precision highp float;
layout(location=0) in vec2 corner;
layout(location=1) in vec4 placement;
layout(location=2) in vec4 lowerRect;
layout(location=3) in vec4 upperRect;
layout(location=4) in vec4 parameters;
layout(location=5) in vec3 tint;
layout(location=6) in vec3 surfaceMaterial;
uniform vec2 resolution;
out vec2 local;
out vec2 screenPoint;
flat out vec4 lowerBounds;
flat out vec4 upperBounds;
flat out vec4 blendParameters;
flat out vec4 color;
flat out vec4 surface;
void main() {
  vec2 point = placement.xy + corner * placement.z;
  gl_Position = vec4(point / resolution * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
  local = corner;
  screenPoint = point;
  lowerBounds = lowerRect;
  upperBounds = upperRect;
  blendParameters = parameters;
  color = vec4(tint, placement.w);
  surface = vec4(placement.z, surfaceMaterial);
}`,_=`#version 300 es
precision highp float;
layout(location=0) in vec2 corner;
layout(location=1) in vec4 endpoints;
layout(location=2) in vec4 stroke;
layout(location=3) in float halfWidth;
uniform vec2 resolution;
uniform float feather;
out vec2 local;
out vec2 screenPoint;
flat out float segmentLength;
flat out float radius;
flat out vec4 color;
void main() {
  vec2 delta = endpoints.zw - endpoints.xy;
  float segmentSize = max(length(delta), 0.0001);
  vec2 direction = delta / segmentSize;
  float padding = halfWidth + feather * 2.0;
  local = vec2((corner.x + 1.0) * 0.5 * (segmentSize + padding * 2.0) - padding, corner.y * padding);
  vec2 point = endpoints.xy + direction * local.x + vec2(-direction.y, direction.x) * local.y;
  gl_Position = vec4(point / resolution * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
  screenPoint = point;
  segmentLength = segmentSize;
  radius = halfWidth;
  color = stroke;
}`,k=`#version 300 es
precision highp float;
uniform float feather;
uniform vec4 cursorLight;
in vec2 local;
in vec2 screenPoint;
flat in float segmentLength;
flat in float radius;
flat in vec4 color;
out vec4 pixel;
void main() {
  float outside = max(max(-local.x, local.x - segmentLength), 0.0);
  float distance = length(vec2(outside, local.y));
  float coverage = 1.0 - smoothstep(radius - feather, radius + feather, distance);
  float proximity = (1.0 - smoothstep(0.0, cursorLight.z, length(screenPoint - cursorLight.xy))) * cursorLight.w;
  float alpha = min(1.0, color.a * (1.0 + proximity * 1.1)) * coverage;
  pixel = vec4(color.rgb * alpha, alpha);
}`;function D(t,e,i){let o=[],s=null;try{for(let[s,r]of[[t.VERTEX_SHADER,e],[t.FRAGMENT_SHADER,i]]){let e=t.createShader(s);if(!e)throw Error("Unable to allocate problem-statement shader.");if(o.push(e),t.shaderSource(e,r),t.compileShader(e),!t.getShaderParameter(e,t.COMPILE_STATUS))throw Error(t.getShaderInfoLog(e)??"ProblemStatement shader compilation failed.")}if(!(s=t.createProgram()))throw Error("Unable to allocate problem-statement program.");for(let e of o)t.attachShader(s,e);if(t.linkProgram(s),!t.getProgramParameter(s,t.LINK_STATUS))throw Error(t.getProgramInfoLog(s)??"ProblemStatement program linking failed.");return s}catch(e){throw s&&t.deleteProgram(s),e}finally{for(let e of o)t.deleteShader(e)}}class B{gl;canvas;restore;textMaskProgram;textMaskUniforms;materialUniforms;dustProgram;dustUniforms;nodeProgram;lineProgram;quadBuffer;nodeBuffer;lineBuffer;nodeArray;lineArray;texture;nodeResolution=null;lineResolution=null;lineFeather=null;lineCursor=null;nodeData=new Float32Array(11264);lineData=new Float32Array(9216);nodeCount=0;lineCount=0;nodeCapacity=0;lineCapacity=0;atlasVersion=-1;width=1;height=1;pixelRatio=1;disposed=!1;lost=!1;constructor(t,e){this.canvas=t,this.restore=e;const i=t.getContext("webgl2",{alpha:!0,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!0,preserveDrawingBuffer:!1});if(!i)throw Error("The problem-statement visual requires WebGL2.");this.gl=i;try{this.initialize()}catch(t){throw this.destroyResources(),t}t.addEventListener("webglcontextlost",this.onLost),t.addEventListener("webglcontextrestored",this.onRestored)}onLost=t=>{t.preventDefault(),this.lost=!0};onRestored=()=>{if(!this.disposed)try{this.initialize(),this.lost=!1,this.restore()}catch{this.lost=!0,this.destroyResources()}};buffer(){let t=this.gl.createBuffer();if(!t)throw Error("Unable to allocate problem-statement geometry.");return t}attributes(t,e,i){let o=this.gl,s=o.createVertexArray();if(!s)throw Error("Unable to allocate problem-statement vertex array.");o.bindVertexArray(s),o.bindBuffer(o.ARRAY_BUFFER,this.quadBuffer??null),o.enableVertexAttribArray(0),o.vertexAttribPointer(0,2,o.FLOAT,!1,8,0),o.bindBuffer(o.ARRAY_BUFFER,t);let r=0;for(let[t,s]of i.entries())o.enableVertexAttribArray(t+1),o.vertexAttribPointer(t+1,s,o.FLOAT,!1,4*e,4*r),o.vertexAttribDivisor(t+1,1),r+=s;return o.bindVertexArray(null),s}initialize(){let t=this.gl;if(this.destroyResources(),this.nodeProgram=D(t,U,E),this.lineProgram=D(t,_,k),this.textMaskProgram=D(t,S,T),this.textMaskUniforms={resolution:t.getUniformLocation(this.textMaskProgram,"resolution"),pixelRatio:t.getUniformLocation(this.textMaskProgram,"pixelRatio"),ellipse:t.getUniformLocation(this.textMaskProgram,"textEllipse")},this.dustProgram=D(t,A,L),this.dustUniforms={resolution:t.getUniformLocation(this.dustProgram,"resolution"),time:t.getUniformLocation(this.dustProgram,"time"),power:t.getUniformLocation(this.dustProgram,"power"),pixelRatio:t.getUniformLocation(this.dustProgram,"pixelRatio")},this.quadBuffer=this.buffer(),t.bindBuffer(t.ARRAY_BUFFER,this.quadBuffer),t.bufferData(t.ARRAY_BUFFER,C,t.STATIC_DRAW),this.nodeBuffer=this.buffer(),this.lineBuffer=this.buffer(),this.nodeArray=this.attributes(this.nodeBuffer,22,[4,4,4,4,3,3]),this.lineArray=this.attributes(this.lineBuffer,9,[4,4,1]),this.texture=t.createTexture()??void 0,!this.texture)throw Error("Unable to allocate problem-statement atlas texture.");t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.nodeResolution=t.getUniformLocation(this.nodeProgram,"resolution"),this.materialUniforms={intensity:t.getUniformLocation(this.nodeProgram,"materialStrength"),dotLighting:t.getUniformLocation(this.nodeProgram,"dotLightStrength"),roughness:t.getUniformLocation(this.nodeProgram,"roughness"),cursor:t.getUniformLocation(this.nodeProgram,"cursorLight")},this.lineResolution=t.getUniformLocation(this.lineProgram,"resolution"),this.lineFeather=t.getUniformLocation(this.lineProgram,"feather"),this.lineCursor=t.getUniformLocation(this.lineProgram,"cursorLight"),t.useProgram(this.nodeProgram),t.uniform1i(t.getUniformLocation(this.nodeProgram,"artwork"),0),this.nodeCapacity=0,this.lineCapacity=0,this.atlasVersion=-1}resize(t,e,i){this.width=t,this.height=e,this.pixelRatio=i;let o=Math.max(1,Math.round(t*i)),s=Math.max(1,Math.round(e*i));this.canvas.width!==o&&(this.canvas.width=o),this.canvas.height!==s&&(this.canvas.height=s)}begin(){this.nodeCount=0,this.lineCount=0}addSprite(t,e,i,o,s,r,a=0){let{lower:n,upper:l,radius:h,mix:d}=i,c=n.size*h/n.radius,u=l.size*h/l.radius,m=Math.max(c,u);if(!(Number.isFinite(t)&&Number.isFinite(e)&&Number.isFinite(m)&&Number.isFinite(r))||m<=0||r<=0)return;let f=m/2;if(t+f<0||e+f<0||t-f>this.width||e-f>this.height)return;if((this.nodeCount+1)*22>this.nodeData.length){let t=new Float32Array(2*this.nodeData.length);t.set(this.nodeData),this.nodeData=t}let p=22*this.nodeCount++,g=this.nodeData;g[p]=t,g[p+1]=e,g[p+2]=f,g[p+3]=Math.min(1,r),g[p+4]=n.u0,g[p+5]=n.v0,g[p+6]=n.u1,g[p+7]=n.v1,g[p+8]=l.u0,g[p+9]=l.v0,g[p+10]=l.u1,g[p+11]=l.v1,g[p+12]=m/c,g[p+13]=m/u,g[p+14]=d,g[p+15]=Number.isFinite(s)?Math.max(0,s):1,g[p+16]=o[0]/255,g[p+17]=o[1]/255,g[p+18]=o[2]/255,g[p+19]=h,g[p+20]=a,g[p+21]=+!!i.isIcon}addLine(t,e,i,o,s,r,a){if(a<=0||!Number.isFinite(t+e+i+o+a+r)||-2>Math.max(t,i)||-2>Math.max(e,o)||Math.min(t,i)>this.width+2||Math.min(e,o)>this.height+2)return;if((this.lineCount+1)*9>this.lineData.length){let t=new Float32Array(2*this.lineData.length);t.set(this.lineData),this.lineData=t}let n=9*this.lineCount++,l=this.lineData;l[n]=t,l[n+1]=e,l[n+2]=i,l[n+3]=o,l[n+4]=s[0]*r/255,l[n+5]=s[1]*r/255,l[n+6]=s[2]*r/255,l[n+7]=Math.min(1,a),l[n+8]=.325}drawDust(t,e=1){if(!(this.dustProgram&&this.dustUniforms)||e<=0)return;let i=this.gl,o=this.dustUniforms;i.bindVertexArray(null),i.useProgram(this.dustProgram),i.uniform2f(o.resolution,this.width,this.height),i.uniform1f(o.time,t.time);let s=Math.max(0,Math.min(1,t.power));i.uniform1f(o.power,s*Math.max(0,Math.min(5,e))),i.uniform1f(o.pixelRatio,this.pixelRatio),i.drawArrays(i.POINTS,0,Math.max(8,Math.min(28,Math.round(this.width*this.height/5e4))))}beginFrame(t,e){if(this.disposed||this.lost)return;let i=this.gl;i.viewport(0,0,this.canvas.width,this.canvas.height),i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.enable(i.BLEND),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ONE_MINUS_SRC_ALPHA),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),this.drawDust(t,e.dustIntensity)}eraseBehindText(t){if(this.disposed||this.lost||!this.textMaskProgram||!this.textMaskUniforms)return;let e=this.gl,i=this.textMaskUniforms;e.bindVertexArray(null),e.useProgram(this.textMaskProgram),e.uniform2f(i.resolution,this.width,this.height),e.uniform1f(i.pixelRatio,this.pixelRatio),e.uniform4f(i.ellipse,t.x,t.y,t.radiusX,t.radiusY),e.blendFunc(e.ZERO,e.ONE_MINUS_SRC_ALPHA),e.drawArrays(e.TRIANGLES,0,3),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA)}setCursorLight(t,e){this.gl.uniform4f(t,((e?.pointerX??0)+1)*this.width*.5,(1-(e?.pointerY??0))*this.height*.5,Math.min(110,.18*this.width),e?.pointerStrength??0)}draw(t,e,i,o){if(this.disposed||this.lost||!this.nodeProgram||!this.lineProgram)return;let s=this.gl;this.lineCount&&(s.useProgram(this.lineProgram),s.uniform2f(this.lineResolution,this.width,this.height),s.uniform1f(this.lineFeather,.5/this.pixelRatio),this.setCursorLight(this.lineCursor,i),s.bindVertexArray(this.lineArray??null),s.bindBuffer(s.ARRAY_BUFFER,this.lineBuffer??null),this.lineCapacity<this.lineData.byteLength&&(s.bufferData(s.ARRAY_BUFFER,this.lineData.byteLength,s.DYNAMIC_DRAW),this.lineCapacity=this.lineData.byteLength),s.bufferSubData(s.ARRAY_BUFFER,0,this.lineData,0,9*this.lineCount),s.drawArraysInstanced(s.TRIANGLES,0,6,this.lineCount)),this.nodeCount&&e>0&&t.width>0&&(s.activeTexture(s.TEXTURE0),s.bindTexture(s.TEXTURE_2D,this.texture??null),e!==this.atlasVersion&&(s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,t),this.atlasVersion=e),s.useProgram(this.nodeProgram),s.uniform2f(this.nodeResolution,this.width,this.height),this.materialUniforms&&(s.uniform1f(this.materialUniforms.intensity,o?.intensity??0),s.uniform1f(this.materialUniforms.dotLighting,o?.dotLighting??.08),s.uniform1f(this.materialUniforms.roughness,o?.roughness??.55),this.setCursorLight(this.materialUniforms.cursor,i)),s.bindVertexArray(this.nodeArray??null),s.bindBuffer(s.ARRAY_BUFFER,this.nodeBuffer??null),this.nodeCapacity<this.nodeData.byteLength&&(s.bufferData(s.ARRAY_BUFFER,this.nodeData.byteLength,s.DYNAMIC_DRAW),this.nodeCapacity=this.nodeData.byteLength),s.bufferSubData(s.ARRAY_BUFFER,0,this.nodeData,0,22*this.nodeCount),s.drawArraysInstanced(s.TRIANGLES,0,6,this.nodeCount)),s.bindVertexArray(null)}destroyResources(){let t=this.gl;for(let e of(this.nodeProgram&&t.deleteProgram(this.nodeProgram),this.lineProgram&&t.deleteProgram(this.lineProgram),this.textMaskProgram&&t.deleteProgram(this.textMaskProgram),this.dustProgram&&t.deleteProgram(this.dustProgram),[this.quadBuffer,this.nodeBuffer,this.lineBuffer]))e&&t.deleteBuffer(e);for(let e of[this.nodeArray,this.lineArray])e&&t.deleteVertexArray(e);this.texture&&t.deleteTexture(this.texture),this.nodeProgram=void 0,this.materialUniforms=void 0,this.lineProgram=void 0,this.textMaskProgram=void 0,this.textMaskUniforms=void 0,this.dustProgram=void 0,this.dustUniforms=void 0,this.quadBuffer=void 0,this.nodeBuffer=void 0,this.lineBuffer=void 0,this.nodeArray=void 0,this.lineArray=void 0,this.texture=void 0}releaseContext(){this.disposed&&!this.canvas.isConnected&&this.gl.getExtension("WEBGL_lose_context")?.loseContext()}dispose(){this.disposed||(this.disposed=!0,this.canvas.removeEventListener("webglcontextlost",this.onLost),this.canvas.removeEventListener("webglcontextrestored",this.onRestored),this.destroyResources(),this.nodeData=new Float32Array(0),this.lineData=new Float32Array(0))}}let F=[255,255,255];class z{simulation;settings;theme;sprites;canvas;gpu;dotColor;lineColor;width=1;height=1;pixelRatio=1;textMask={x:0,y:0,radiusX:1,radiusY:1};atmosphere={time:0,power:0,pointerX:0,pointerY:0,pointerStrength:0};material=m;ready=!1;disposed=!1;constructor(t,e,i=a){this.settings={...i},this.simulation=new p(this.settings),this.theme=e,this.dotColor=[Math.round(e.dot[0]),Math.round(e.dot[1]),Math.round(e.dot[2])],this.lineColor=[Math.round(e.line[0]),Math.round(e.line[1]),Math.round(e.line[2])],this.sprites=new P,this.canvas=t;try{this.gpu=new B(t,()=>this.redraw())}catch(t){throw this.sprites.dispose(),t}}async load(){await this.sprites.load(),this.disposed||(this.ready=!0)}resize(t,e,i,o,s=t/2,r=e/2){this.disposed||(this.width=Math.max(1,t),this.height=Math.max(1,e),this.pixelRatio=Math.min(window.devicePixelRatio||1,1.5),this.textMask.x=s,this.textMask.y=r,this.textMask.radiusX=Math.max(1,.51*Math.min(.92*this.width,1.5*i)),this.textMask.radiusY=Math.max(1,1.02*o),this.gpu.resize(this.width,this.height,this.pixelRatio))}pause(){this.simulation.acc=0}render(t,e,i,o,s=1){if(this.disposed||!this.ready)return;this.simulation.setPointer(i,this.width,this.height),this.simulation.update(t,e,o,s),o||(this.atmosphere.time+=Math.min(Math.max(t,0),1/30)*s),this.atmosphere.power=.45+.55*Math.max(0,Math.min(1,e));let r=i.active&&!o,a=1-Math.exp(-Math.min(Math.max(t,0),1/30)*(r?14:8));this.atmosphere.pointerStrength=o?0:this.atmosphere.pointerStrength+(Number(r)-this.atmosphere.pointerStrength)*a,r&&(this.atmosphere.pointerX=i.x,this.atmosphere.pointerY=i.y),this.redraw()}redraw(){if(this.disposed||!this.ready)return;let t=this.project(),e=[...t].sort((t,e)=>t.z-e.z),i=this.gpu;for(let o of(i.beginFrame(this.atmosphere,this.material),[!1,!0]))i.begin(),this.drawConnections(i,t,o),this.drawNodes(i,e,o),i.draw(this.sprites.atlas,this.sprites.version,this.atmosphere,this.material),o||i.eraseBehindText(this.textMask)}project(){let{x:t,y:e}=h(this.width,this.height),i=1+this.settings.netSpread/100*.65;return this.simulation.nodes.slice(0,this.simulation.active).map((o,s)=>{let[r,a,n]=o.p,l=2.8/(2.8-n);return{x:this.width/2+r*t*l*i,y:this.height/2+a*e*l*i,z:n,scale:l,node:o,index:s}})}drawConnections(t,e,i){let o=(this.settings.netTextDepth/100-.5)*2.4;for(let[s,r]of this.simulation.links){if(r>=e.length)continue;let a=e[s],n=e[r],l=Math.min(a.node.visibility,n.node.visibility);if(0===l)continue;let h=.32*this.material.curve*((s+r)%2?1:-1),d=function(t,e,i){let{from:o,control:s,to:r}=t,a=o.z>i;if(a===r.z>i)return a===e?t:null;let n=(i-o.z)/(r.z-o.z),l={x:o.x+(s.x-o.x)*n,y:o.y+(s.y-o.y)*n},h={x:s.x+(r.x-s.x)*n,y:s.y+(r.y-s.y)*n},d={x:l.x+(h.x-l.x)*n,y:l.y+(h.y-l.y)*n,z:i};return a===e?{from:o,control:l,to:d}:{from:d,control:h,to:r}}({from:a,to:n,control:{x:(a.x+n.x)/2-(n.y-a.y)*h,y:(a.y+n.y)/2+(n.x-a.x)*h}},i,o);if(!d)continue;let c=Math.exp(-Math.abs((a.z+n.z)/2-o)*this.settings.netDim/100*1.6),u=this.lineColor,m=a.node.group===n.node.group?.24:.14,f=Math.hypot(d.control.x-(d.from.x+d.to.x)/2,d.control.y-(d.from.y+d.to.y)/2),p=f<.25?1:Math.min(64,Math.max(2,Math.ceil(Math.sqrt(f/.4)))),g=d.from.x,v=d.from.y;for(let e=1;e<=p;e++){let i=e/p,o=1-i,s=o*o*d.from.x+2*o*i*d.control.x+i*i*d.to.x,r=o*o*d.from.y+2*o*i*d.control.y+i*i*d.to.y;t.addLine(g,v,s,r,u,c,l*m),g=s,v=r}}}drawNodes(t,e,i){let o=(this.settings.netTextDepth/100-.5)*2.4,s=1-.3*l(this.width),r=this.material,a=r.bloomIntensity;for(let{node:n,index:l,x:h,y:d,z:u,scale:m}of e){if(u>o!==i||0===n.visibility)continue;let e=!n.central&&.61803398875*l%1>=1-this.settings.netFaviconRatio/100,f=c(n.visibility),p=(this.settings.netIconMin+Math.abs(Math.sin(78.233*l))*(this.settings.netIconMax-this.settings.netIconMin))*Math.max(.85,Math.min(1.35,m))*.72*s,g=this.settings.netDotSize*(n.central?1:1.35)*r.dotScale,v=e?p:g*(.65+n.r/.023*.35)*m,x=Math.abs(u-o),y=function(t,e,i,o){let s=Math.max(0,Math.abs(t+.25*Math.sin(i*(.35+.1*Math.sin(e))+e))-.08);return Math.min(4.5,s*s/(s+.1)*o/100*16)}(u-o,n.phase,this.simulation.time,this.settings.netBlur)*f,b=this.sprites.sample(l,v*f,y,e);if(!b)continue;let M=n.central?this.theme.line:this.dotColor;e&&(M=F);let w=Math.exp(-x*this.settings.netDim/100*1.8),R=n.visibility*(n.central?.85:1);if(t.addSprite(h,d,b,M,w,R),a>0){let i=this.sprites.sample(l,v*f,Math.hypot(y,r.bloomRadius*f),e);i&&t.addSprite(h,d,i,e?F:this.theme.line,w,R,2.5*a)}}}releaseContext(){this.gpu.releaseContext()}dispose(){this.disposed||(this.disposed=!0,this.ready=!1,this.sprites.dispose(),this.gpu.dispose(),this.canvas.width=0,this.canvas.height=0)}}
export { z as NetworkRenderer };
