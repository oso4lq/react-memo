const API_URL = "https://wedev-api.sky.pro/api/v2/leaderboard";

export async function getScores() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No authorization");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    const data = await response.json();
    return data.leaders;
  } catch (error) {
    console.warn(error);
    throw error;
  }
}

export async function addScore({ name, time, achievements }) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name,
        time,
        achievements,
      }),
    });
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    return response.json();
  } catch (error) {
    alert("No internet connection. Try again later.");
    console.warn(error);
    throw error;
  }
}
