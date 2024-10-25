
import Cookies from "js-cookie";
export const isAuthenticated = () => {
  // 쿠키에서 access-token을 가져옴
  const token = Cookies.get('access-token');
  console.log(token)
  
  // 토큰이 존재하면 로그인 상태로 판단
  return !!token;
};