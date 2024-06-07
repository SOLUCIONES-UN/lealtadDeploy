const url = "https://lealtadv2be.onrender.com/";
let token = localStorage.getItem("token");

$(function () {
  const getParticipaciones = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`${url}Participacion`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  getParticipaciones();
});
