import React from "react";
import { Card, Row, Col } from "antd";
import "../styles/custom.style.css";
const { Meta } = Card;

export const BloodGroupCards = ({ bloodGroupsData }) => {
  const colours = [
    "#D7DAE5",
    "#ADD8E6",
    "#C8D5B9",
    "#F5DEB3",
    "#87CEFA",
    "#AFEEEE",
    "#EED7C5",
    "#9DC5BB",
  ];

  return (
    <Row gutter={-16} className="blood-group-cards">
      {bloodGroupsData.map((bloodGroup, index) => {
        const color = colours[index];
        return (
          <Col span={6} key={index}>
            <Card
              className="custom-card"
              style={{
                backgroundColor: color,
                color: "white",
                margin: "-8px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition:
                  "transform 0.4s, background-color 0.3s, color 0.3s, z-index 0.3s",
              }}
              cover={
                <div className="card-cover">
                  <h1 className="text-5xl uppercase">
                    {bloodGroup.bloodGroup}
                  </h1>
                </div>
              }
            >
              <Meta
                style={{ marginBottom: "5px" }}
                title="Total In"
                description={`${bloodGroup.totalIN} ML`}
              />
              <Meta
                style={{ marginBottom: "5px" }}
                title="Total Out"
                description={`${bloodGroup.totalOUT} ML`}
              />
              <Meta
                style={{ marginBottom: "5px" }}
                title="Available"
                description={`${bloodGroup.avaialbleQuantity} ML`}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};
