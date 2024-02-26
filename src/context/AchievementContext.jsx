import React, { createContext, useContext, useState } from "react";

const AchievementsContext = createContext();

export const AchievementsProvider = ({ children }) => {
  const [achievementsList, setAchievementsList] = useState([]);

  const addAchievement = achievementId => {
    setAchievementsList(prevList => [...prevList, achievementId]);
    console.log("achievement added");
    console.log("achievementId ", achievementId);
  };

  const resetAchievements = () => {
    setAchievementsList([]);
    console.log("achievement reset");
  };

  return (
    <AchievementsContext.Provider value={{ achievementsList, addAchievement, resetAchievements }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => useContext(AchievementsContext);
