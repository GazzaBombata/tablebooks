import Userfront from "@userfront/core";

Userfront.init("wn9vz89b");

export const fetchRole = async () => {

  if (!Userfront.tokens.accessToken) {
    return null;
  }

  let res;

  try {
    res = await fetch('http://localhost:8080/v1/check-role', {
      headers: {
        Authorization: `Bearer ${Userfront.tokens.accessToken}`,
      },
    });

    const data = await res.json();
    console.log('response from fetchRole')
    console.log(data);

    if (!res.ok) {
      console.log(data);
      throw new Error('Network response was not ok');
    }

    return data;

  } catch (error) {
    console.log(error);
  }

};