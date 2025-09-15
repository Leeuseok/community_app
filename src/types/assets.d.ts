// 이미지 및 정적 자산 타입 선언
// TypeScript가 로컬 이미지(.png/.jpg/.jpeg/.svg/.webp/.gif)를 import 할 수 있도록 합니다.

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.webp' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}
