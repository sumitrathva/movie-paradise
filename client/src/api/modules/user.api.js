import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

const userEndpoints = {
  signin: "user/signin",
  signup: "user/signup",
  getInfo: "user/info",
  passwordUpdate: "user/update-password"
};

const userApi = {
  signin: async ({ username, password }) => {
    try {
      console.log("send request");
      const response = await publicClient.post(
        userEndpoints.signin,
        { username, password }
      );

      return { response };
    } catch (err) { console.log("err"); return { err }; }
  },
  signup: async ({ username, displayName, password, confirmPassword }) => { // ✅ Added displayName
    try {
      const response = await publicClient.post(
        userEndpoints.signup,
        { username, displayName, password, confirmPassword } // ✅ Included displayName in request body
      );
      
      console.log("✅ Signup Success:", response.data);
      return { response };
    } catch (err) {
      console.log("❌ Signup Error:", err.response?.data || err.message);
      return { err };
    }
  },
  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);

      return { response };
    } catch (err) { return { err }; }
  },
  passwordUpdate: async ({ password, newPassword, confirmNewPassword }) => {
    try {
      const response = await privateClient.put(
        userEndpoints.passwordUpdate,
        { password, newPassword, confirmNewPassword }
      );

      return { response };
    } catch (err) { return { err }; }
  }
};

export default userApi;
