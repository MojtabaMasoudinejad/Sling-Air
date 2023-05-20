import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Form from "./Form";
import Plane from "./Plane";

const SeatSelect = ({ selectedFlight, setReservationId }) => {
  const [selectedSeat, setSelectedSeat] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e, formData) => {
    e.preventDefault();
    // TODO: POST info to server is DONE
    // TODO: Save reservationId is DONE

    fetch("/api/add-reservation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flightNumber: selectedFlight,
        flightSeat: selectedSeat,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setReservationId(data.data.insertedId);
      });

    // TODO: Redirect to confirmation page is DONE
    navigate("/confirmation");
  };

  return (
    <Wrapper>
      <h2>Select your seat and Provide your information!</h2>
      <>
        <FormWrapper>
          <Plane
            setSelectedSeat={setSelectedSeat}
            selectedFlight={selectedFlight}
          />
          <Form handleSubmit={handleSubmit} selectedSeat={selectedSeat} />
        </FormWrapper>
      </>
    </Wrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  margin: 50px 0px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export default SeatSelect;
