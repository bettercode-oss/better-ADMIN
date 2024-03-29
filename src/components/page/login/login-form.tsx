import {Alert, Button, Form, Input, Skeleton} from "antd";
import {useForm} from "antd/lib/form/Form";
import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import React, {useCallback, useState} from "react";
import MemberSignUpModal from "@/components/page/login/member-sign-up-modal";
import LoginWithDoorayAccountModal from "@/components/page/login/login-with-dooray-account-modal";
import {useSiteSettings} from "@/client/settings/site-settings";

interface ILoginFormValue {
  id: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [form] = useForm<ILoginFormValue>();
  const [isLoading, setIsLoading] = useState(false);
  const [showMemberSinUpModal, setShowMemberSinUpModal] = useState(false);
  const [showLoginWithDoorayAccountModal, setShowLoginWithDoorayAccountModal] = useState(false);

  const {data: siteSettings, error, isLoading: isLoadingSiteSettings} = useSiteSettings();

  const handleFinish = useCallback(async (value: ILoginFormValue) => {
    setIsLoading(true);

    try {
      await signIn("login-credentials", {id: value.id, password: value.password});
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  const handleError = (): JSX.Element => {
    if (router?.query.error) {
      const err: string = router.query.error as string;
      if (err === "CredentialsSignInBadRequest") {
        return <>
          <Alert message="아이디 또는 비밀번호를 확인해주세요." type="error"/>
        </>
      }

      if (err === "CredentialsSignInUnapproved") {
        return <>
          <Alert message="신청한 계정은 아직 미승인 상태 입니다. 관리자에게 문의하세요." type="error"/>
        </>
      }

      if (err === "CredentialsSignInInternalError") {
        return <>
          <Alert message="오류가 발생 했습니다. 다시 한번 시도해 주세요." type="error"/>
        </>
      }

      return <></>
    }

    return <></>
  }

  if(!error) {
    if (!siteSettings || isLoadingSiteSettings) {
      return <Skeleton className="my-5"/>;
    }
  }

  return (
    <>
      <div className="mb-3">
        {handleError()}
      </div>

      <Form<ILoginFormValue>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item name="id" rules={[{required: true, message: "아이디를 입력해주세요"}]}>
          <Input size="large" placeholder="아이디"/>
        </Form.Item>

        <Form.Item name="password" rules={[{required: true, message: "비밀번호를 입력해주세요"}]}>
          <Input placeholder="비밀번호" type="password" size="large"/>
        </Form.Item>

        <Button size="large" type="primary" htmlType="submit" className="w-full" loading={isLoading}>
          로그인
        </Button>

        아직 계정이 없으신가요? <a className="inline-block mt-2 text-gray-400" onClick={() => setShowMemberSinUpModal(true)}>
        신청하기
      </a>
      </Form>
      <MemberSignUpModal open={showMemberSinUpModal} onHide={() => setShowMemberSinUpModal(false)}/>
      {siteSettings && siteSettings.doorayLoginUsed &&
        <>
          <div className="my-5 text-lg text-center text-gray-400">다른 수단으로 로그인</div>
          <div className="grid grid-cols-2 gap-4">
            <a className="flex items-center justify-center h-20 grow btn"
               onClick={() => setShowLoginWithDoorayAccountModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="166" height="36"
                   viewBox="0 0 166 36">
                <defs>
                  <path id="441nqrf5va" d="M0.286 0.166L4.008 0.166 4.008 17.528 0.286 17.528z"/>
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <g>
                    <g>
                      <g>
                        <g>
                          <g>
                            <path fill="#494949"
                                  d="M3.359 14.033h3.223c1.452 0 2.564-.5 3.358-1.475.795-.976 1.204-2.224 1.204-3.722 0-1.475-.41-2.678-1.204-3.654S8.034 3.707 6.582 3.707H3.359v10.326zM0 17.256V.484h6.559c2.52 0 4.493.749 5.923 2.27 1.43 1.497 2.157 3.54 2.157 6.15 0 2.565-.727 4.607-2.202 6.105-1.453 1.498-3.45 2.247-6.014 2.247H0zM22.6 14.6c.975 0 1.77-.34 2.427-1.02.658-.705 1-1.544 1-2.52s-.342-1.816-1-2.497c-.658-.68-1.452-1.02-2.428-1.02s-1.793.34-2.45 1.02c-.66.681-.977 1.521-.977 2.497s.318 1.815.976 2.52c.658.68 1.475 1.02 2.451 1.02m-4.766-8.147c1.249-1.271 2.837-1.906 4.766-1.906 1.93 0 3.518.635 4.766 1.906 1.248 1.248 1.861 2.791 1.861 4.607 0 1.838-.613 3.381-1.861 4.63-1.248 1.248-2.837 1.884-4.766 1.884-1.929 0-3.517-.636-4.766-1.884-1.248-1.249-1.86-2.792-1.86-4.63 0-1.816.612-3.359 1.86-4.607M36.985 14.6c.976 0 1.77-.34 2.428-1.02.658-.705 1-1.544 1-2.52s-.342-1.816-1-2.497c-.658-.68-1.452-1.02-2.428-1.02s-1.793.34-2.45 1.02c-.66.681-.977 1.521-.977 2.497s.318 1.815.976 2.52c.658.68 1.475 1.02 2.451 1.02M32.22 6.453c1.248-1.271 2.837-1.906 4.766-1.906 1.93 0 3.518.635 4.766 1.906 1.248 1.248 1.86 2.791 1.86 4.607 0 1.838-.612 3.381-1.86 4.63-1.248 1.248-2.837 1.884-4.766 1.884-1.93 0-3.518-.636-4.766-1.884-1.248-1.249-1.86-2.792-1.86-4.63 0-1.816.612-3.359 1.86-4.607M45.414 17.256V4.887h3.064v1.657c.749-1.34 1.883-1.997 3.404-1.997.5 0 .999.09 1.498.272l-.273 3.064c-.522-.16-1.02-.25-1.475-.25-1.816 0-3.018 1.18-3.018 3.745v5.878h-3.2zM62.894 8.54c-.658-.703-1.475-1.043-2.474-1.043-1.021 0-1.838.34-2.496 1.044-.636.703-.953 1.543-.953 2.519 0 .998.317 1.838.976 2.542.657.703 1.474 1.044 2.473 1.044.999 0 1.816-.34 2.474-1.044.658-.704.999-1.544.999-2.542 0-.976-.34-1.816-.999-2.52zm.953-3.653h3.041v12.368h-3.041v-1.429c-1.067 1.157-2.383 1.725-3.949 1.725-1.77 0-3.245-.613-4.402-1.861-1.158-1.249-1.725-2.815-1.725-4.675 0-1.861.59-3.405 1.747-4.607 1.157-1.226 2.633-1.839 4.38-1.839 1.544 0 2.86.59 3.949 1.793V4.887zM77.743 4.887h3.495l-4.97 12.982c-1.203 3.154-2.791 4.652-5.243 4.652-.93 0-1.724-.204-2.383-.613l.545-2.678c.567.273 1.112.409 1.588.409.999 0 1.793-.658 2.406-1.952l.25-.567L68.03 4.887h3.699l3.2 8.057 2.814-8.057z"
                                  transform="translate(-190 -382) translate(130 365) translate(60 17) translate(1 9) translate(78)"/>
                            <g
                              transform="translate(-190 -382) translate(130 365) translate(60 17) translate(1 9) translate(78) translate(82.16)">
                              <mask id="388n791fgb" fill="#fff">
                                <use xlinkHref="#441nqrf5va"/>
                              </mask>
                              <path fill="#494949"
                                    d="M.65 12.603L.466.166H3.85l-.227 12.437H.65zm-.364 3.064c0-1.021.817-1.816 1.883-1.816 1.022 0 1.839.795 1.839 1.816 0 1.09-.817 1.861-1.839 1.861-1.066 0-1.883-.772-1.883-1.861z"
                                    mask="url(#388n791fgb)"/>
                            </g>
                          </g>
                          <path fill="#FA2828"
                                d="M30.048 7.162c-.634 0-.872.094-1.27.45-.415.374-1.278 1.264-1.472 1.55-.094.135-.055.26.024.393.464.79 1.309 1.026 2.505 1.026h9.131c.635 0 .873-.093 1.27-.45.415-.373 1.278-1.262 1.473-1.548.093-.136.054-.263-.024-.395-.464-.789-1.31-1.026-2.506-1.026h-9.131z"
                                transform="translate(-190 -382) translate(130 365) translate(60 17) translate(1 9)"/>
                          <path fill="#494949"
                                d="M53.562 5.324c-.565-.288-.82-.312-1.335-.175-.54.144-1.713.545-2.016.711-.145.079-.167.208-.157.362.055.914.7 1.508 1.766 2.051l8.137 4.146c.565.288.82.313 1.335.175.54-.144 1.712-.545 2.016-.71.144-.08.167-.21.158-.363-.056-.914-.701-1.509-1.768-2.052l-8.136-4.145zM46.762.56c-.125-.074-.243-.11-.371-.022-.27.183-1.11.997-1.461 1.39-.336.374-.425.599-.425 1.197v11.694c0 1.129.223 1.926.968 2.364.124.074.244.11.372.023.27-.184 1.108-.998 1.46-1.39.336-.374.425-.6.425-1.198V2.923c0-1.128-.223-1.924-.968-2.362M68.046.56c-.125-.074-.243-.11-.371-.022-.269.183-1.108.997-1.46 1.39-.337.374-.426.599-.426 1.197v11.694c0 1.129.224 1.926.968 2.364.125.074.244.11.372.023.27-.184 1.109-.998 1.46-1.39.337-.374.425-.6.425-1.198V2.923c0-1.128-.223-1.924-.968-2.362M9.057 5.324c-.565-.288-.819-.312-1.335-.175-.54.144-1.713.545-2.016.711-.145.079-.167.208-.157.362.056.914.7 1.508 1.766 2.051l8.136 4.146c.566.288.82.313 1.336.175.54-.144 1.712-.545 2.016-.71.144-.08.167-.21.157-.363-.055-.914-.7-1.509-1.767-2.052L9.057 5.324zM2.257.56C2.132.487 2.013.45 1.886.539 1.616.72.777 1.535.425 1.928.089 2.301 0 2.526 0 3.124v11.694c0 1.129.223 1.926.967 2.364.125.074.245.11.373.023.269-.184 1.109-.998 1.46-1.39.337-.374.425-.6.425-1.198V2.923c0-1.128-.223-1.924-.968-2.362M23.542.56c-.125-.074-.244-.11-.372-.022-.269.183-1.108.997-1.46 1.39-.337.374-.425.599-.425 1.197v11.694c0 1.129.223 1.926.967 2.364.125.074.244.11.373.023.269-.184 1.108-.998 1.46-1.39.336-.374.425-.6.425-1.198V2.923c0-1.128-.224-1.924-.968-2.362"
                                transform="translate(-190 -382) translate(130 365) translate(60 17) translate(1 9)"/>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </a>
          </div>
          <LoginWithDoorayAccountModal open={showLoginWithDoorayAccountModal}
                                       onHide={() => setShowLoginWithDoorayAccountModal(false)}/>
        </>
      }
    </>
  );
};

export default React.memo(LoginForm);