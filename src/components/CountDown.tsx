import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import styled from "@emotion/styled";

const PrimaryInfo = styled.p`
  display: flex;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 0;
`;

export enum CooldownPeriodState {
  NotActive,
  Active,
  UnStake,
}

export interface CountDownProps {
  endTime: number;
}

export interface CountDownNumberProps {
  endTime: Dayjs;
  now: Dayjs;
}

const CountDownContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  border: dotted 5px black;
  border-radius: 7px;
  background-origin: border-box;
  background-clip: content-box, border-box;
`;

const CountDownNumber = ({ endTime, now }: CountDownNumberProps) => {
  const [timeString] = useMemo(() => {
    const secondsDiff = endTime.diff(now, "seconds");

    const days = Math.floor(secondsDiff / 86400);
    const hours = Math.floor((secondsDiff % 86400) / 3600);
    const mins = Math.floor((secondsDiff % 3600) / 60);
    const secs = Math.floor(secondsDiff % 60);

    const timeString =
      secondsDiff > 0
        ? `${`${days}`.padStart(2, "0")}${`${hours}`.padStart(
            2,
            "0"
          )}${`${mins}`.padStart(2, "0")}${`${secs}`.padStart(2, "0")}`
        : "00000000";

    return [timeString];
  }, [now, endTime]);

  return (
    <PrimaryInfo>
      {timeString.slice(0, 2)}:{timeString.slice(2, 4)}:{timeString.slice(4, 6)}
      :{timeString.slice(6, 8)}
    </PrimaryInfo>
  );
};

export const CountDownBox = (props: CountDownProps) => {
  const { endTime: endTimeProps } = props;

  const [now, setNow] = useState<Dayjs>(dayjs());

  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const endTime = dayjs.unix(endTimeProps);

  useEffect(() => {
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    const intervalFn = () => {
      if (endTime.unix() === 0 || !endTime) {
        cleanup();
      } else {
        setNow(dayjs().add(-1, "second"));
      }
    };
    intervalFn(); // immediate execute once

    intervalRef.current = setInterval(intervalFn, 1000);
    return cleanup;
  }, []);

  return (
    <CountDownContainer>
      <CountDownNumber now={now} endTime={endTime} />
    </CountDownContainer>
  );
};
