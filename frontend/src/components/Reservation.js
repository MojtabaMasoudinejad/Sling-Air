import styled from "styled-components";
import { useEffect, useState } from "react";

import tombstone from "../assets/tombstone.png";

const Reservation = ({ reservationId }) => {
  const [reservationData, setReservationData] = useState([]);

  useEffect(() => {
    fetch(`/api/get-reservation/${reservationId}`)
      .then((response) => response.json())
      .then((data) => setReservationData(data.data));
  }, [reservationId]);

  if (!reservationData) {
    return <h1>Loading . . .</h1>;
  }

  // TODO: Display the latest reservation information is DONE
  return (
    <DivMain>
      <Logo src={tombstone} />
      <Wrapper>
        <ConfirmDiv>Reservation page</ConfirmDiv>
        <DivItem>
          Name : <b>{reservationData.givenName}</b>
        </DivItem>
        <DivItem>
          Surname: <b>{reservationData.surname}</b>
        </DivItem>
        <DivItem>
          Email Address: <b>{reservationData.email}</b>
        </DivItem>
        <DivItem>
          Flight Number: <b>{reservationData.flight}</b>
        </DivItem>
        <DivItem>
          Seat Number: <b>{reservationData.seat}</b>
        </DivItem>
      </Wrapper>
    </DivMain>
  );
};

const DivMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  height: 200px;
  width: 150px;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
`;

const ConfirmDiv = styled.div`
  font-size: 25px;
`;

const DivItem = styled.div`
  margin-top: 15px;
`;

export default Reservation;
