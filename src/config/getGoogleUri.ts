import { GOOGLE_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URI } from "./constant";

export const getGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options: Record<string, string>    = {
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URI ,
    client_id: GOOGLE_CLIENT_ID ,
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  
 

  return `${rootUrl}?${qs.toString()}`;
}

export default getGoogleUrl;

