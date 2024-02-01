import Userfront from "@userfront/core";

Userfront.init("wn9vz89b");

export const createTable = async (restaurantID, table) => {

  let res;

  try {
    table.RestaurantID = restaurantID,
    
    res = await fetch('http://localhost:8080/v1/tables', {
      headers: {
        Authorization: `Bearer ${Userfront.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(table),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Error: ${res.status}, ${errorData.message}`);
    }

    const data = await res.json();

    return data;

  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }


};