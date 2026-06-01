import axios from "axios";
import { useStateContext } from "../context/State";
import { authUrl } from "../configs/auth-url.js";

export default function useAuthApi() {
  const { setUser, setError, setIsLoading, refUrl } = useStateContext();

  async function emailAuth(data) {
    setError(null);
    if (!refUrl || !/^http(s)?:\/\//.test(refUrl)) {
      setError("redirect url not found go back to main site");
      return false;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${authUrl}/email`,
        {
          email: data.email,
        },
        {
          withCredentials: true,
        }
      );
      setUser(res?.data?.data);
      return true;
    } catch (error) {
      setError(
        error?.response?.data?.message || "Email login failed, try later"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyEmail(data) {
    setError(null);
    if (!refUrl || !/^http(s)?:\/\//.test(refUrl)) {
      setError("redirect url not found go back to main site");
      return false;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${authUrl}/email/verify`,
        {
          otp: data.otp,
          email: data.email,
        },
        {
          withCredentials: true,
        }
      );
      setUser(res?.data?.data);
      return res.data.data;
    } catch (error) {
      setError(error?.response?.data?.message || "Invalid or expired OTP");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function phoneAuth(data) {
    setError(null);
    if (!refUrl || !/^http(s)?:\/\//.test(refUrl)) {
      setError("redirect url not found go back to main site");
      return false;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${authUrl}/phone`,
        {
          phone: data.phone,
        },
        {
          withCredentials: true,
        }
      );
      setUser(res?.data?.data);
      return true;
    } catch (error) {
      setError(
        error?.response?.data?.message || "phone login failed, try later"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyPhone(data) {
    setError(null);
    if (!refUrl || !/^http(s)?:\/\//.test(refUrl)) {
      setError("redirect url not found go back to main site");
      return false;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${authUrl}/phone/verify`,
        {
          phone: data.phone,
          otp: data.otp,
          name: data.name,
        },
        {
          withCredentials: true,
        }
      );
      setUser(res?.data?.data);
      return res.data.data;
    } catch (error) {
      setError(error?.response?.data?.message || "Invalid or expired OTP");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function googleAuth(code) {
    setError(null);
    if (!refUrl || !/^http(s)?:\/\//.test(refUrl)) {
      setError("redirect url not found go back to main site");
      return false;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${authUrl}/google`,
        {
          code,
        },
        {
          withCredentials: true,
        }
      );
      setUser(res?.data?.data);
      return res.data.data;
    } catch (error) {
      setError(
        error?.response?.data?.message || "Google login failed, try later"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function githubAuth(code) {
    setError(null);
    if (!refUrl || !/^http(s)?:\/\//.test(refUrl)) {
      setError("redirect url not found go back to main site");
      setIsLoading(false);
      return false;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${authUrl}/github`,
        {
          code,
        },
        {
          withCredentials: true,
        }
      );
      setUser(res?.data?.data);
      setIsLoading(false);
      return res.data.data;
    } catch (error) {
      setError(
        error?.response?.data?.message || "Github login failed, try later"
      );
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    emailAuth,
    verifyEmail,
    phoneAuth,
    verifyPhone,
    googleAuth,
    githubAuth,
  };
}
