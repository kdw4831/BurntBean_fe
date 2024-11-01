import axios from "axios";



const baseURL = process.env.REACT_APP_BASE_URL;


const axiosClient = axios.create({
    baseURL: baseURL,
    withCredentials: true, // 쿠키를 자동으로 포함시킵니다.
});


// 모달 핸들러 저장 변수
let showModalHandler;

// 요청 인터셉터 추가: 모든 요청 전에 실행
axiosClient.interceptors.request.use(
    config => {
        // 여기서 JWT 토큰이 필요한 경우 추가적인 로직을 수행할 수 있습니다.
        // 예를 들어, 추가 헤더 설정, 로깅 등
        return config;
    },
    error => {
        // 요청 에러 처리
        return Promise.reject(error);
    }
);


// 모달 핸들러 설정 함수
axiosClient.setShowModalHandler = handler => {
    showModalHandler = handler;
};
  

// 응답 인터셉터 추가: 모든 응답 후에 실행
axiosClient.interceptors.response.use(
    response => {
        // 응답 데이터를 그대로 반환하거나 추가 처리를 할 수 있습니다.
        if (response.status === 201) {
            // 모달 표시 함수 호출
            if (showModalHandler) {
              showModalHandler(true);
            }
        }
        return response;
    },
    async error => {
        if (error.response && error.response.status === 401) {
            // 401 오류 시 refresh-token으로 access-token 재생성
            try {
                const response = await axiosClient.post('/refresh');
                return axiosClient(error.config);
                
            } catch (error) {
                console.error('Error creating resource:', error);
                throw error;
            }
      
        } else if (error.response && (error.response.status === 403 || error.response.status === 404)) {
        
            // 403 Forbidden 오류 처리 (접근 권한 없음)            
            console.error('Access forbidden:', error);
            
         
          
            window.location.href="/login"
          
        
        } else {
            // 기타 오류 처리
            console.error('An error occurred:', error);
        }

        return Promise.reject(error);
    }
);


export { axiosClient }; 