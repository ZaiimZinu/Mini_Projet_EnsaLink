import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TrustedDevicesLocations from "../components/profile/TrustedDevicesLocations";
import PrimaryDevicesLocations from "../components/profile/PrimaryDevicesLocations";
import BlockedDevicesLocations from "../components/profile/BlockedDevicesLocations";
import CommonLoading from "../components/loader/CommonLoading";

import {
  getTrustedContextAuthDataAction,
  getUserPreferencesAction,
  getBlockedAuthContextDataAction,
  getContextAuthDataAction,
} from "../redux/actions/authActions";

const DevicesLocations = () => {
  const dispatch = useDispatch();
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserPreferencesAction());
      await dispatch(getContextAuthDataAction());
      await dispatch(getTrustedContextAuthDataAction());
      await dispatch(getBlockedAuthContextDataAction());
    };
    fetchData().then(() => setDataFetched(true));
  }, [dispatch, dataFetched]);

  const userPreferences = useSelector((state) => state.auth?.userPreferences);
  const contextAuthData = useSelector((state) => state.auth?.contextAuthData);
  const trustedAuthContextData = useSelector(
    (state) => state.auth?.trustedAuthContextData
  );
  const blockedContextAuthData = useSelector(
    (state) => state.auth?.blockedAuthContextData
  );

  if (!dataFetched) {
    return (
      <div className="col-span-2 flex items-center justify-center h-screen bg-gray-900 text-white">
        <CommonLoading />
      </div>
    );
  }

  if (!userPreferences || !contextAuthData) {
    return (
      <div className="main-section bg-gray-900 border p-5 text-white text-center">
        <p className="text-lg font-semibold mb-4">
          Context-based authentication is currently disabled for your account.
        </p>
        <p className="text-sm">
          By enabling context-based authentication, you will gain control over
          your devices, their locations, and manage trusted and blocked devices.
        </p>
      </div>
    );
  }

  return (
    <div className="main-section border bg-gray-900 text-white">
      <PrimaryDevicesLocations contextAuthData={contextAuthData} />
      <TrustedDevicesLocations
        trustedAuthContextData={trustedAuthContextData}
      />
      <BlockedDevicesLocations
        blockedContextAuthData={blockedContextAuthData}
      />
    </div>
  );
};

export default DevicesLocations;
