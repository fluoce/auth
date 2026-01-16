import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import SocialBtn from "../ui/SocialBtn";
import { useStateContext } from "@/context/State";
import { useLocation } from "react-router-dom";
import useAuthApi from "@/api/auth-api";

const Github = () => {
  const { isLoading, refUrl, setLastUsedSocial, setIsLoading, setError } =
    useStateContext();

  const location = useLocation();

  const { githubAuth } = useAuthApi();

  const githubLogin = () => {
    setIsLoading(true);
    const state = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();

    sessionStorage.setItem("github_oauth_state", state);

    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_APP_URL + "/auth",
      scope: "read:user user:email",
      state: state,
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code || !state) return;

    const storedState = sessionStorage.getItem("github_oauth_state");

    if (state != storedState) return;

    sessionStorage.removeItem("github_oauth_state");

    const handleEffect = async () => {
      await handleGithubResponse(code);
      const url = new URL(window.location);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
    };

    handleEffect();
  }, [location.search]);

  const handleGithubResponse = async (code) => {
    if (code) {
      const success = await githubAuth(code);
      if (success && success.code) {
        if (refUrl && /^http(s)?:\/\//.test(refUrl)) {
          window.location.replace(refUrl + `?code=${success?.code}`);
          localStorage.removeItem("refUrl");
        } else {
          setError("redirect url not found go back to main site");
        }
        setLastUsedSocial("github");
      }
    } else {
      setError("Github login failed !");
    }
  };

  return (
    <SocialBtn
      onClick={githubLogin}
      isLoding={isLoading}
      icon={<FaGithub />}
      name={"Github"}
    />
  );
};

export default Github;
