// import { createContext, useEffect, useState, useContext } from "react";
// import { fetchProfileInfo } from "../APIS/APIS";

// const profileContext = createContext();

// export const ProfileContextProvider = ({ children }) => {
//   const [profile, setProfile] = useState();
//   const [loading, setLoading] = useState(false);

//   const getProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await fetchProfileInfo();
//       if (response.status === 200) {
//         setProfile(response.data);
//         console.log(response.data);
//         setLoading(false);
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     getProfile();
//   }, []);

//   const clearProfile = () => setProfile(null);

//   return (
//     <profileContext.Provider
//       value={{ profile, loading, getProfile, clearProfile, setProfile }}
//     >
//       {children}
//     </profileContext.Provider>
//   );
// };

// export const useProfileContext = () => useContext(profileContext);

import { createContext, useState, useContext } from "react";
import { fetchProfileInfo } from "../APIS/APIS";

const profileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await fetchProfileInfo();
      if (response.status === 200 && response.data) {
        setProfile(response.data);
        return response.data; // IMPORTANT: return profile
      }
      setProfile(null);
      return null;
    } catch (err) {
      console.log("getProfile error:", err);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => setProfile(null);

  return (
    <profileContext.Provider
      value={{ profile, loading, getProfile, clearProfile, setProfile }}
    >
      {children}
    </profileContext.Provider>
  );
};

export const useProfileContext = () => useContext(profileContext);
