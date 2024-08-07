"use client";

import React from "react";
import PocketBaseComponent from "./component/PocketBaseComponent";
import PocketBaseUsageComponent from "./component/PocketBaseUsageComponent";
import type { NextPage } from "next";

const PocketBaseExtension: NextPage = () => {
  return (
    <div>
      <PocketBaseUsageComponent />
      <PocketBaseComponent />
    </div>
  );
};

export default PocketBaseExtension;
