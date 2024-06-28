import AuthComponent from "../components/AuthComponent";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <AuthComponent className={"bg-loginImageLight dark:bg-loginImageDark"}>
      <LoginForm />
    </AuthComponent>
  );
}

export default Login;
