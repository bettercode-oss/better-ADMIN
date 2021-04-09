import React from "react";

import {
  faUsers,
  faBuilding,
  faCalendar,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Home.module.css";

const Home = () => {
  //TODO: 중요 미처리 건 색상 변경용. 추후 api 연동.
  let stateEmergency = false;

  const emergencyColor = (state) => {
    if (state === true) {
      return styles.summryModule;
    } else {
      return styles.summryModuleEmergency;
    }
  };

  return (
    <>
      <div>
        <section id="summury" className={styles.item}>
          <div className={styles.summryModule}>
            <FontAwesomeIcon icon={faUsers} size="3x" />
            <div className={styles.summuryText}>
              <span className={styles.summuryTitle}>총 가입자</span>
              <span className={styles.summuryCount}>10,001</span>
            </div>
          </div>
          <div className={styles.summryModule}>
            <FontAwesomeIcon icon={faBuilding} size="3x" />
            <div className={styles.summuryText}>
              <span className={styles.summuryTitle}>등록 기업</span>
              <span className={styles.summuryCount}>2,000</span>
            </div>
          </div>
          <div className={styles.summryModule}>
            <FontAwesomeIcon icon={faCalendar} size="3x" />
            <div className={styles.summuryText}>
              <span className={styles.summuryTitle}>진행중 캠페인</span>
              <span className={styles.summuryCount}>5</span>
            </div>
          </div>
          <div className={emergencyColor(stateEmergency)}>
            <FontAwesomeIcon icon={faQuestion} size="3x" />
            <div className={styles.summuryText}>
              <span className={styles.summuryTitle}>미처리 문의</span>
              <span className={styles.summuryCount}>2</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
