import * as React from "react";

interface InverterPowerSVGTypes {
    value : number;
}

function scaleValue(value : number, srcRange : number[], dstRange: number[]) : any {
    const [srcMin, srcMax] = srcRange;
    const [dstMin, dstMax] = dstRange;
  
    // Perform the scaling
    const scaledValue = dstMin + ((value - srcMin) / (srcMax - srcMin)) * (dstMax - dstMin);
  
    return scaledValue;
  }

const InverterPowerSVG : React.FC <InverterPowerSVGTypes> = ({value}) => {
   
var srcRange = [0, 1500];
var dstRange = [110, -250];

// Example usage
// var value1 = 1400; // A value in the range 0 to 1500
const scaledValue = scaleValue(value, srcRange, dstRange);

var srcRange = [0, 1500];
var dstRange = [0, 360];

const scaledValueBar = scaleValue(value, srcRange, dstRange);

var bar = `M ${scaledValueBar + 0.2812} 0L ${scaledValueBar + 0.2812} 28.8722L7.91303 28.8722C4.04703 28.8722 0.913024 25.7382 0.913024 21.8722L0.913025 7C0.913025 3.134 4.04704 -3.83985e-06 7.91302 -3.67161e-06L92.2812 0Z`

    
return (

  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    // width={"100%"}
    // height={"auto"}
    viewBox="-0.5 -0.5 480 237"
    preserveAspectRatio="xMidYMid meet"
    style={{
      backgroundColor: "rgb(255, 255, 255)",
      width : "100%",
      height : "auto",
      marginTop : "-7%"
    }}
  >
    <defs />
    <rect fill="#ffffff" width="100%" height="100%" x={0} y={0} />
    <g>
      <g data-cell-id={0}>
        <g data-cell-id={1}>
          <g data-cell-id="sh3UrY8xxK1YU0T2wWRl-1">
            <g>
              <g>
                <svg
                  fill="none"
                  viewBox="0 0 480 237"
                  preserveAspectRatio="xMidYMid meet"
                  // height={237}
                  // width={480}
                  xmlns="http://www.w3.org/2000/svg"
                  x={-0.5}
                  y={-0.5}
                  style={{
                    fontFamily: "initial",
                    width : "100%",
                    height : "auto"
                  }}
                >
                  {"\n"}
                  <rect
                    fill="url(#paint0_linear_581_9820)"
                    transform="rotate(90 480 0)"
                    rx={4}
                    height={480}
                    width={480}
                    x={480}
                  />
                  {"\n"}
                  <defs>
                    {"\n"}
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      y2={414.605}
                      x2={712.613}
                      y1={0.00000451288}
                      x1={447.311}
                      id="paint0_linear_581_9820"
                    >
                      {"\n"}
                      <stop stopColor="#3B8475" offset={0.415838} />
                      {"\n"}
                      <stop stopColor="#74B348" offset={0.880588} />
                      {"\n"}
                    </linearGradient>
                    {"\n"}
                  </defs>
                  {"\n"}
                </svg>
              </g>
            </g>
          </g>
          <g data-cell-id="sh3UrY8xxK1YU0T2wWRl-2">
            <g>
              <g>
                <svg
                  fill="none"
                  viewBox="0 0 98 12"
                  height={12}
                  width={98}
                  xmlns="http://www.w3.org/2000/svg"
                  x={19.5}
                  y={29.5}
                  style={{
                    fontFamily: "initial",
                  }}
                >
                  {"\n"}
                  <path
                    fill="white"
                    d="M1.84872 5.818182V11H0.00426134V0.818182H1.84872ZM5.56623 6.52557V11H3.76651V3.36364H5.48668V4.66122H5.57617C5.75183 4.23366 6.0319 3.89394 6.41637 3.64205C6.80415 3.39015 7.28308 3.2642 7.85316 3.2642C8.38015 3.2642 8.83919 3.37689 9.23029 3.60227C9.6247 3.82765 9.92963 4.15412 10.1451 4.58168C10.3638 5.00923 10.4715 5.52794 10.4682 6.13778V11H8.6685V6.41619C8.6685 5.90578 8.53593 5.50639 8.27077 5.21804C8.00894 4.92969 7.64601 4.78551 7.182 4.78551C6.86713 4.78551 6.58706 4.85511 6.3418 4.99432C6.09985 5.13021 5.90927 5.32741 5.77006 5.58594C5.63417 5.84446 5.56623 6.15767 5.56623 6.52557ZM18.8453 3.36364L16.1259 11H14.1373L11.4178 3.36364H13.3368L15.0918 9.03622H15.1713L16.9313 3.36364H18.8453ZM23.2116 11.1491C22.446 11.1491 21.7848 10.9901 21.228 10.6719C20.6745 10.3504 20.2486 9.89631 19.9503 9.30966C19.652 8.7197 19.5028 8.02533 19.5028 7.22656C19.5028 6.44105 19.652 5.75166 19.9503 5.15838C20.2519 4.56179 20.6728 4.09777 21.2131 3.76633C21.7533 3.43158 22.388 3.2642 23.1172 3.2642C23.5878 3.2642 24.032 3.34044 24.4496 3.4929C24.8705 3.64205 25.2417 3.87405 25.5632 4.18892C25.888 4.50379 26.1432 4.90483 26.3288 5.39205C26.5144 5.87595 26.6072 6.45265 26.6072 7.12216V7.67401H20.348V6.46094H24.8821C24.8788 6.11624 24.8042 5.80966 24.6584 5.54119C24.5125 5.26941 24.3087 5.05563 24.0469 4.89986C23.7884 4.74408 23.4867 4.66619 23.142 4.66619C22.7741 4.66619 22.451 4.75568 22.1726 4.93466C21.8942 5.11032 21.6771 5.34233 21.5213 5.63068C21.3688 5.91572 21.291 6.22893 21.2876 6.57031V7.62926C21.2876 8.07339 21.3688 8.45455 21.5312 8.77273C21.6937 9.08759 21.9207 9.32955 22.2124 9.49858C22.504 9.6643 22.8454 9.74716 23.2365 9.74716C23.4983 9.74716 23.7353 9.7107 23.9474 9.63778C24.1596 9.56155 24.3435 9.45052 24.4993 9.30469C24.6551 9.15885 24.7727 8.97822 24.8523 8.76278L26.5327 8.9517C26.4266 9.39583 26.2244 9.78362 25.9261 10.1151C25.6312 10.4432 25.2533 10.6984 24.7926 10.8807C24.3319 11.0597 23.8049 11.1491 23.2116 11.1491ZM28.1298 11V3.36364H29.8748V4.63636H29.9544C30.0936 4.19555 30.3322 3.85582 30.6703 3.61719C31.0117 3.37524 31.4011 3.25426 31.8386 3.25426C31.938 3.25426 32.0491 3.25923 32.1717 3.26918C32.2976 3.2758 32.402 3.2874 32.4849 3.30398V4.95952C32.4087 4.933 32.2877 4.9098 32.122 4.88991C31.9596 4.86671 31.8021 4.85511 31.6497 4.85511C31.3216 4.85511 31.0266 4.92637 30.7647 5.06889C30.5062 5.2081 30.3024 5.40199 30.1532 5.65057C30.0041 5.89915 29.9295 6.18584 29.9295 6.51065V11H28.1298ZM37.9039 3.36364V4.75568H33.514V3.36364H37.9039ZM34.5978 1.53409H36.3975V8.70312C36.3975 8.94508 36.434 9.13068 36.5069 9.25994C36.5832 9.38589 36.6826 9.47206 36.8052 9.51847C36.9279 9.56487 37.0637 9.58807 37.2129 9.58807C37.3256 9.58807 37.4283 9.57978 37.5211 9.56321C37.6172 9.54664 37.6902 9.53172 37.7399 9.51847L38.0431 10.9254C37.947 10.9586 37.8095 10.995 37.6305 11.0348C37.4548 11.0746 37.2394 11.0978 36.9842 11.1044C36.5334 11.1177 36.1274 11.0497 35.7662 10.9006C35.4049 10.7481 35.1182 10.5128 34.9061 10.1946C34.6973 9.87642 34.5945 9.47869 34.5978 9.00142V1.53409ZM42.7077 11.1491C41.9421 11.1491 41.2809 10.9901 40.7241 10.6719C40.1706 10.3504 39.7447 9.89631 39.4464 9.30966C39.1481 8.7197 38.9989 8.02533 38.9989 7.22656C38.9989 6.44105 39.1481 5.75166 39.4464 5.15838C39.748 4.56179 40.1689 4.09777 40.7092 3.76633C41.2494 3.43158 41.8841 3.2642 42.6133 3.2642C43.0839 3.2642 43.5281 3.34044 43.9457 3.4929C44.3666 3.64205 44.7378 3.87405 45.0593 4.18892C45.3841 4.50379 45.6393 4.90483 45.8249 5.39205C46.0105 5.87595 46.1033 6.45265 46.1033 7.12216V7.67401H39.8441V6.46094H44.3782C44.3749 6.11624 44.3003 5.80966 44.1545 5.54119C44.0086 5.26941 43.8048 5.05563 43.543 4.89986C43.2844 4.74408 42.9828 4.66619 42.6381 4.66619C42.2702 4.66619 41.9471 4.75568 41.6687 4.93466C41.3903 5.11032 41.1732 5.34233 41.0174 5.63068C40.8649 5.91572 40.7871 6.22893 40.7837 6.57031V7.62926C40.7837 8.07339 40.8649 8.45455 41.0273 8.77273C41.1897 9.08759 41.4168 9.32955 41.7085 9.49858C42.0001 9.6643 42.3415 9.74716 42.7326 9.74716C42.9944 9.74716 43.2314 9.7107 43.4435 9.63778C43.6557 9.56155 43.8396 9.45052 43.9954 9.30469C44.1512 9.15885 44.2688 8.97822 44.3484 8.76278L46.0288 8.9517C45.9227 9.39583 45.7205 9.78362 45.4222 10.1151C45.1272 10.4432 44.7494 10.6984 44.2887 10.8807C43.828 11.0597 43.301 11.1491 42.7077 11.1491ZM47.6259 11V3.36364H49.3709V4.63636H49.4505C49.5897 4.19555 49.8283 3.85582 50.1664 3.61719C50.5078 3.37524 50.8972 3.25426 51.3347 3.25426C51.4341 3.25426 51.5452 3.25923 51.6678 3.26918C51.7937 3.2758 51.8981 3.2874 51.981 3.30398V4.95952C51.9048 4.933 51.7838 4.9098 51.6181 4.88991C51.4557 4.86671 51.2982 4.85511 51.1458 4.85511C50.8176 4.85511 50.5227 4.92637 50.2608 5.06889C50.0023 5.2081 49.7985 5.40199 49.6493 5.65057C49.5002 5.89915 49.4256 6.18584 49.4256 6.51065V11H47.6259ZM56.7289 11V0.818182H60.5471C61.3292 0.818182 61.9855 0.964015 62.5158 1.25568C63.0494 1.54735 63.4521 1.94839 63.7239 2.45881C63.999 2.96591 64.1365 3.54261 64.1365 4.18892C64.1365 4.84186 63.999 5.42187 63.7239 5.92898C63.4488 6.43608 63.0428 6.83546 62.5059 7.12713C61.9689 7.41548 61.3077 7.55966 60.5222 7.55966H57.9917V6.04332H60.2736C60.731 6.04332 61.1055 5.96378 61.3972 5.80469C61.6889 5.6456 61.9043 5.42685 62.0435 5.14844C62.186 4.87003 62.2573 4.55019 62.2573 4.18892C62.2573 3.82765 62.186 3.50947 62.0435 3.23438C61.9043 2.95928 61.6872 2.7455 61.3922 2.59304C61.1006 2.43726 60.7244 2.35938 60.2637 2.35938H58.5733V11H56.7289ZM68.8807 11.1491C68.1349 11.1491 67.4886 10.9851 66.9418 10.657C66.3949 10.3288 65.9706 9.86979 65.669 9.27983C65.3707 8.68987 65.2216 8.00047 65.2216 7.21165C65.2216 6.42282 65.3707 5.73177 65.669 5.13849C65.9706 4.54522 66.3949 4.08452 66.9418 3.75639C67.4886 3.42827 68.1349 3.2642 68.8807 3.2642C69.6264 3.2642 70.2727 3.42827 70.8196 3.75639C71.3665 4.08452 71.7891 4.54522 72.0874 5.13849C72.389 5.73177 72.5398 6.42282 72.5398 7.21165C72.5398 8.00047 72.389 8.68987 72.0874 9.27983C71.7891 9.86979 71.3665 10.3288 70.8196 10.657C70.2727 10.9851 69.6264 11.1491 68.8807 11.1491ZM68.8906 9.70739C69.295 9.70739 69.633 9.59635 69.9048 9.37429C70.1766 9.14891 70.3788 8.8473 70.5114 8.46946C70.6473 8.09162 70.7152 7.67069 70.7152 7.20668C70.7152 6.73935 70.6473 6.31676 70.5114 5.93892C70.3788 5.55777 70.1766 5.2545 69.9048 5.02912C69.633 4.80374 69.295 4.69105 68.8906 4.69105C68.4763 4.69105 68.1316 4.80374 67.8565 5.02912C67.5848 5.2545 67.3809 5.55777 67.245 5.93892C67.1125 6.31676 67.0462 6.73935 67.0462 7.20668C67.0462 7.67069 67.1125 8.09162 67.245 8.46946C67.3809 8.8473 67.5848 9.14891 67.8565 9.37429C68.1316 9.59635 68.4763 9.70739 68.8906 9.70739ZM75.4245 11L73.2669 3.36364H75.1014L76.4437 8.73295H76.5133L77.8855 3.36364H79.7001L81.0723 8.70312H81.1468L82.4693 3.36364H84.3088L82.1461 11H80.2718L78.84 5.83949H78.7356L77.3038 11H75.4245ZM88.7273 11.1491C87.9616 11.1491 87.3004 10.9901 86.7436 10.6719C86.1901 10.3504 85.7642 9.89631 85.4659 9.30966C85.1676 8.7197 85.0185 8.02533 85.0185 7.22656C85.0185 6.44105 85.1676 5.75166 85.4659 5.15838C85.7675 4.56179 86.1884 4.09777 86.7287 3.76633C87.2689 3.43158 87.9036 3.2642 88.6328 3.2642C89.1035 3.2642 89.5476 3.34044 89.9652 3.4929C90.3861 3.64205 90.7573 3.87405 91.0788 4.18892C91.4036 4.50379 91.6589 4.90483 91.8445 5.39205C92.0301 5.87595 92.1229 6.45265 92.1229 7.12216V7.67401H85.8636V6.46094H90.3977C90.3944 6.11624 90.3198 5.80966 90.174 5.54119C90.0282 5.26941 89.8243 5.05563 89.5625 4.89986C89.304 4.74408 89.0024 4.66619 88.6577 4.66619C88.2898 4.66619 87.9666 4.75568 87.6882 4.93466C87.4098 5.11032 87.1927 5.34233 87.0369 5.63068C86.8845 5.91572 86.8066 6.22893 86.8033 6.57031V7.62926C86.8033 8.07339 86.8845 8.45455 87.0469 8.77273C87.2093 9.08759 87.4363 9.32955 87.728 9.49858C88.0196 9.6643 88.361 9.74716 88.7521 9.74716C89.014 9.74716 89.2509 9.7107 89.4631 9.63778C89.6752 9.56155 89.8591 9.45052 90.0149 9.30469C90.1707 9.15885 90.2884 8.97822 90.3679 8.76278L92.0483 8.9517C91.9422 9.39583 91.7401 9.78362 91.4418 10.1151C91.1468 10.4432 90.7689 10.6984 90.3082 10.8807C89.8475 11.0597 89.3205 11.1491 88.7273 11.1491ZM93.6454 11V3.36364H95.3904V4.63636H95.47C95.6092 4.19555 95.8478 3.85582 96.1859 3.61719C96.5273 3.37524 96.9167 3.25426 97.3542 3.25426C97.4537 3.25426 97.5647 3.25923 97.6873 3.26918C97.8133 3.2758 97.9177 3.2874 98.0005 3.30398V4.95952C97.9243 4.933 97.8033 4.9098 97.6376 4.88991C97.4752 4.86671 97.3178 4.85511 97.1653 4.85511C96.8372 4.85511 96.5422 4.92637 96.2804 5.06889C96.0218 5.2081 95.818 5.40199 95.6689 5.65057C95.5197 5.89915 95.4451 6.18584 95.4451 6.51065V11H93.6454Z"
                  />
                  {"\n"}
                </svg>
              </g>
            </g>
          </g>
          <g data-cell-id="sh3UrY8xxK1YU0T2wWRl-3">
            <g>
              <g>
                <svg
                  fill="none"
                  viewBox="0 0 156 35"
                  height={35}
                  width={156}
                  xmlns="http://www.w3.org/2000/svg"
                  x={209.5}
                  y={88}
                  style={{
                    fontFamily: "initial",
                  }}
                >
                  {"\n"}
                  <text
                    x={3}
                    y={34}
                    fontWeight={600}
                    fontSize={30}
                    fill="white"
                  >
                    {value + "kW"}
                  </text>
                  {"\n"}
                </svg>
              </g>
            </g>
          </g>
          <g data-cell-id="sh3UrY8xxK1YU0T2wWRl-4">
            <g>
              <g>
                <svg
                  fill="none"
                  viewBox="0 0 92 92"
                  height={92}
                  width={92}
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns="http://www.w3.org/2000/svg"
                  x={29.5}
                  y={59.5}
                  style={{
                    fontFamily: "initial",
                  }}
                >
                  {"\n"}
                  <rect fill="url(#pattern0_581_9925)" height={92} width={92} />
                  {"\n"}
                  <defs>
                    {"\n"}
                    <pattern
                      height={1}
                      width={1}
                      patternContentUnits="objectBoundingBox"
                      id="pattern0_581_9925"
                    >
                      {"\n"}
                      <use
                        transform="scale(0.00390625)"
                        xlinkHref="#image0_581_9925"
                      />
                      {"\n"}
                    </pattern>
                    {"\n"}
                    <image
                      xlinkHref="data:image/png;base64,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"
                      height={256}
                      width={256}
                      id="image0_581_9925"
                    />
                    {"\n"}
                  </defs>
                  {"\n"}
                </svg>
              </g>
            </g>
          </g>
          <g data-cell-id="sh3UrY8xxK1YU0T2wWRl-5">
            <g>
              <g>
                <svg
                  fill="none"
                  viewBox="0 0 365 30"
                  height={30}
                  width={365}
                  xmlns="http://www.w3.org/2000/svg"
                  x={29.5}
                  y={169.5}
                  style={{
                    fontFamily: "initial",
                  }}
                >
                  {"\n"}
                  <path
                    fill="url(#paint0_linear_581_9846)"
                    d="M359.076 0L359.076 27.8723C359.076 28.4245 358.628 28.8723 358.076 28.8723L6.99905 28.8722C3.13306 28.8722 -0.000947175 25.7382 -0.000947005 21.8722L-0.000946352 6.99999C-0.000946183 3.13399 3.13306 -1.54902e-05 6.99905 -1.5322e-05L359.076 0Z"
                  />
                  {"\n"}
                  <path
                    fill="url(#paint1_linear_581_9846)"
                    d={bar}
                  />
                  {"\n"}
                  <ellipse
                    fill="url(#paint2_linear_581_9846)"
                    transform="rotate(90 92.6725 14.6414)"
                    ry={5.87436}
                    rx={14.6414}
                    cy={scaledValue}
                    cx={92.6725}
                  />
                  {"\n"}
                  <path
                    fill="url(#paint3_linear_581_9846)"
                    d="M359.297 29.2732C356.148 29.2732 353.595 22.7202 353.595 14.6366C353.595 6.55303 356.148 -3.85231e-07 359.297 -2.4817e-07C362.447 -1.1111e-07 365 6.55303 365 14.6366C365 22.7202 362.447 29.2732 359.297 29.2732Z"
                  />
                  {"\n"}
                  <defs>
                    {"\n"}
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      y2={14.4361}
                      x2={-0.000946679}
                      y1={14.4361}
                      x1={359.076}
                      id="paint0_linear_581_9846"
                    >
                      {"\n"}
                      <stop stopColor="#E4E5E7" offset={0.005} />
                      {"\n"}
                      <stop stopColor="#96969A" offset={1} />
                      {"\n"}
                    </linearGradient>
                    {"\n"}
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      y2={14.4361}
                      x2={94.2077}
                      y1={14.4361}
                      x1={0.913024}
                      id="paint1_linear_581_9846"
                    >
                      {"\n"}
                      <stop stopColor="#8842E0" />
                      {"\n"}
                      <stop stopColor="#42BAE0" offset={0.521347} />
                      {"\n"}
                      <stop stopColor="#10FF53" offset={1} />
                      {"\n"}
                    </linearGradient>
                    {"\n"}
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      y2={14.6414}
                      x2={107.314}
                      y1={14.6414}
                      x1={78.0311}
                      id="paint2_linear_581_9846"
                    >
                      {"\n"}
                      <stop stopColor="#09B11A" />
                      {"\n"}
                      <stop stopColor="#0C7717" offset={1} />
                      {"\n"}
                    </linearGradient>
                    {"\n"}
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      y2={29.2732}
                      x2={357.742}
                      y1={-3.22575e-7}
                      x1={357.742}
                      id="paint3_linear_581_9846"
                    >
                      {"\n"}
                      <stop stopColor="#BDBDC0" />
                      {"\n"}
                      <stop stopColor="#DEDEE1" offset={1} />
                      {"\n"}
                    </linearGradient>
                    {"\n"}
                  </defs>
                  {"\n"}
                </svg>
              </g>
            </g>
          </g>
          <g data-cell-id="sh3UrY8xxK1YU0T2wWRl-8">
            <g>
              <g>
                <svg
                  fill="none"
                  viewBox="0 0 10 13"
                  height={13}
                  width={10}
                  xmlns="http://www.w3.org/2000/svg"
                  x={29.5}
                  y={209.5}
                  style={{
                    fontFamily: "initial",
                  }}
                >
                  {"\n"}
                  <path
                    fill="white"
                    d="M5.33523 12.2216C4.39962 12.2216 3.59659 11.9848 2.92614 11.5114C2.25947 11.0341 1.74621 10.3466 1.38636 9.44886C1.0303 8.54735 0.852273 7.46212 0.852273 6.19318C0.856061 4.92424 1.03598 3.8447 1.39205 2.95455C1.75189 2.06061 2.26515 1.37879 2.93182 0.909091C3.60227 0.439394 4.40341 0.204545 5.33523 0.204545C6.26705 0.204545 7.06818 0.439394 7.73864 0.909091C8.40909 1.37879 8.92235 2.06061 9.27841 2.95455C9.63826 3.84848 9.81818 4.92803 9.81818 6.19318C9.81818 7.46591 9.63826 8.55303 9.27841 9.45455C8.92235 10.3523 8.40909 11.0379 7.73864 11.5114C7.07197 11.9848 6.27083 12.2216 5.33523 12.2216ZM5.33523 10.4432C6.0625 10.4432 6.63636 10.0852 7.05682 9.36932C7.48106 8.64962 7.69318 7.59091 7.69318 6.19318C7.69318 5.26894 7.59659 4.49242 7.40341 3.86364C7.21023 3.23485 6.9375 2.76136 6.58523 2.44318C6.23295 2.12121 5.81629 1.96023 5.33523 1.96023C4.61174 1.96023 4.03977 2.32008 3.61932 3.03977C3.19886 3.75568 2.98674 4.80682 2.98295 6.19318C2.97917 7.12121 3.07197 7.90151 3.26136 8.53409C3.45455 9.16667 3.72727 9.64394 4.07955 9.96591C4.43182 10.2841 4.85038 10.4432 5.33523 10.4432Z"
                  />
                  {"\n"}
                </svg>
              </g>
            </g>
          </g>
          <g data-cell-id="sh3UrY8xxK1YU0T2wWRl-9">
            <g>
              <g>
                <svg
                  fill="none"
                  viewBox="0 0 39 13"
                  height={13}
                  width={39}
                  xmlns="http://www.w3.org/2000/svg"
                  x={355.5}
                  y={209.5}
                  style={{
                    fontFamily: "initial",
                  }}
                >
                  {"\n"}
                  <path
                    fill="white"
                    d="M5.76705 0.363636V12H3.65909V2.41477H3.59091L0.869318 4.15341V2.22159L3.76136 0.363636H5.76705ZM12.767 12.1591C12.0095 12.1591 11.3314 12.017 10.733 11.733C10.1345 11.4451 9.65909 11.0511 9.30682 10.5511C8.95833 10.0511 8.77273 9.47917 8.75 8.83523H10.7955C10.8333 9.3125 11.0398 9.70265 11.4148 10.0057C11.7898 10.3049 12.2405 10.4545 12.767 10.4545C13.1799 10.4545 13.5473 10.3598 13.8693 10.1705C14.1913 9.98106 14.4451 9.7178 14.6307 9.38068C14.8163 9.04356 14.9072 8.65909 14.9034 8.22727C14.9072 7.78788 14.8144 7.39773 14.625 7.05682C14.4356 6.71591 14.1761 6.44886 13.8466 6.25568C13.517 6.05871 13.1383 5.96023 12.7102 5.96023C12.3617 5.95644 12.0189 6.02083 11.6818 6.15341C11.3447 6.28598 11.0777 6.46023 10.8807 6.67614L8.97727 6.36364L9.58523 0.363636H16.3352V2.125H11.3295L10.9943 5.21023H11.0625C11.2784 4.95644 11.5833 4.74621 11.9773 4.57955C12.3712 4.40909 12.803 4.32386 13.2727 4.32386C13.9773 4.32386 14.6061 4.49053 15.1591 4.82386C15.7121 5.15341 16.1477 5.60795 16.4659 6.1875C16.7841 6.76705 16.9432 7.42992 16.9432 8.17614C16.9432 8.94508 16.7652 9.63068 16.4091 10.233C16.0568 10.8314 15.5663 11.303 14.9375 11.6477C14.3125 11.9886 13.589 12.1591 12.767 12.1591ZM23.1477 12.2216C22.2121 12.2216 21.4091 11.9848 20.7386 11.5114C20.072 11.0341 19.5587 10.3466 19.1989 9.44886C18.8428 8.54735 18.6648 7.46212 18.6648 6.19318C18.6686 4.92424 18.8485 3.8447 19.2045 2.95455C19.5644 2.06061 20.0777 1.37879 20.7443 0.909091C21.4148 0.439394 22.2159 0.204545 23.1477 0.204545C24.0795 0.204545 24.8807 0.439394 25.5511 0.909091C26.2216 1.37879 26.7348 2.06061 27.0909 2.95455C27.4508 3.84848 27.6307 4.92803 27.6307 6.19318C27.6307 7.46591 27.4508 8.55303 27.0909 9.45455C26.7348 10.3523 26.2216 11.0379 25.5511 11.5114C24.8845 11.9848 24.0833 12.2216 23.1477 12.2216ZM23.1477 10.4432C23.875 10.4432 24.4489 10.0852 24.8693 9.36932C25.2936 8.64962 25.5057 7.59091 25.5057 6.19318C25.5057 5.26894 25.4091 4.49242 25.2159 3.86364C25.0227 3.23485 24.75 2.76136 24.3977 2.44318C24.0455 2.12121 23.6288 1.96023 23.1477 1.96023C22.4242 1.96023 21.8523 2.32008 21.4318 3.03977C21.0114 3.75568 20.7992 4.80682 20.7955 6.19318C20.7917 7.12121 20.8845 7.90151 21.0739 8.53409C21.267 9.16667 21.5398 9.64394 21.892 9.96591C22.2443 10.2841 22.6629 10.4432 23.1477 10.4432ZM33.8196 12.2216C32.884 12.2216 32.081 11.9848 31.4105 11.5114C30.7438 11.0341 30.2306 10.3466 29.8707 9.44886C29.5147 8.54735 29.3366 7.46212 29.3366 6.19318C29.3404 4.92424 29.5204 3.8447 29.8764 2.95455C30.2363 2.06061 30.7495 1.37879 31.4162 0.909091C32.0866 0.439394 32.8878 0.204545 33.8196 0.204545C34.7514 0.204545 35.5526 0.439394 36.223 0.909091C36.8935 1.37879 37.4067 2.06061 37.7628 2.95455C38.1226 3.84848 38.3026 4.92803 38.3026 6.19318C38.3026 7.46591 38.1226 8.55303 37.7628 9.45455C37.4067 10.3523 36.8935 11.0379 36.223 11.5114C35.5563 11.9848 34.7552 12.2216 33.8196 12.2216ZM33.8196 10.4432C34.5469 10.4432 35.1207 10.0852 35.5412 9.36932C35.9654 8.64962 36.1776 7.59091 36.1776 6.19318C36.1776 5.26894 36.081 4.49242 35.8878 3.86364C35.6946 3.23485 35.4219 2.76136 35.0696 2.44318C34.7173 2.12121 34.3007 1.96023 33.8196 1.96023C33.0961 1.96023 32.5241 2.32008 32.1037 3.03977C31.6832 3.75568 31.4711 4.80682 31.4673 6.19318C31.4635 7.12121 31.5563 7.90151 31.7457 8.53409C31.9389 9.16667 32.2116 9.64394 32.5639 9.96591C32.9162 10.2841 33.3348 10.4432 33.8196 10.4432Z"
                  />
                  {"\n"}
                </svg>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
};
export default InverterPowerSVG;
