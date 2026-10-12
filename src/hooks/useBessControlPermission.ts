import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "bess-control-permission";

interface PermissionState {
  controlOwner: string | null;
  permissionRequestedBy: string | null;
  permissionGrantedTo: string | null;
}

const DEFAULT_STATE: PermissionState = {
  controlOwner: null,
  permissionRequestedBy: null,
  permissionGrantedTo: null,
};

function getStoredState(): PermissionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEFAULT_STATE;
    }

    const parsed = JSON.parse(raw);

    return {
      controlOwner: parsed?.controlOwner ?? null,
      permissionRequestedBy: parsed?.permissionRequestedBy ?? null,
      permissionGrantedTo: parsed?.permissionGrantedTo ?? null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: PermissionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  // Same-tab components ko bhi immediately update karne ke liye
  window.dispatchEvent(new Event("bess-control-permission-change"));
}

export default function useBessControlPermission() {
  const [permission, setPermission] =
    useState<PermissionState>(getStoredState);

  const currentUser =
    sessionStorage.getItem("userName") ||
    sessionStorage.getItem("identifier") ||
    "";

  const refresh = useCallback(() => {
    setPermission(getStoredState());
  }, []);

  useEffect(() => {
    const handleChange = () => {
      refresh();
    };

    window.addEventListener(
      "bess-control-permission-change",
      handleChange
    );

    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(
        "bess-control-permission-change",
        handleChange
      );

      window.removeEventListener("storage", handleChange);
    };
  }, [refresh]);

  const canControl =
    !permission.controlOwner ||
    permission.controlOwner === currentUser ||
    permission.permissionGrantedTo === currentUser;

  /**
   * Current user ne actual control save kiya.
   * Agar koi owner nahi hai to current user owner banega.
   *
   * Agar kisi ko permission grant hui thi aur us user ne save kiya,
   * to control us user ko transfer ho jayega.
   */
  const claimControl = useCallback(() => {
    const latest = getStoredState();

    const nextState: PermissionState = {
      controlOwner: currentUser,
      permissionRequestedBy: null,
      permissionGrantedTo: null,
    };

    // Current user ko hi owner banana hai
    if (
      latest.controlOwner === currentUser ||
      latest.permissionGrantedTo === currentUser ||
      !latest.controlOwner
    ) {
      saveState(nextState);
      setPermission(nextState);
    }
  }, [currentUser]);

  /**
   * Another user se permission request
   */
  const requestPermission = useCallback(() => {
    if (!currentUser) return;

    const latest = getStoredState();

    if (!latest.controlOwner) {
      const nextState: PermissionState = {
        ...latest,
        controlOwner: currentUser,
        permissionRequestedBy: null,
        permissionGrantedTo: null,
      };

      saveState(nextState);
      setPermission(nextState);
      return;
    }

    if (latest.controlOwner === currentUser) {
      return;
    }

    if (latest.permissionRequestedBy) {
      return;
    }

    const nextState: PermissionState = {
      ...latest,
      permissionRequestedBy: currentUser,
      permissionGrantedTo: null,
    };

    saveState(nextState);
    setPermission(nextState);
  }, [currentUser]);

  /**
   * Current owner request ko grant karega
   */
  const grantPermission = useCallback(() => {
    const latest = getStoredState();

    if (
      latest.controlOwner !== currentUser ||
      !latest.permissionRequestedBy
    ) {
      return;
    }

    const nextState: PermissionState = {
      ...latest,
      permissionGrantedTo: latest.permissionRequestedBy,
    };

    saveState(nextState);
    setPermission(nextState);
  }, [currentUser]);

  /**
   * Current owner request deny karega
   */
  const denyPermission = useCallback(() => {
    const latest = getStoredState();

    if (latest.controlOwner !== currentUser) {
      return;
    }

    const nextState: PermissionState = {
      ...latest,
      permissionRequestedBy: null,
      permissionGrantedTo: null,
    };

    saveState(nextState);
    setPermission(nextState);
  }, [currentUser]);

  return {
    currentUser,
    controlOwner: permission.controlOwner,
    permissionRequestedBy: permission.permissionRequestedBy,
    permissionGrantedTo: permission.permissionGrantedTo,
    canControl,
    requestPermission,
    grantPermission,
    denyPermission,
    claimControl,
    refresh,
  };
}