import React, { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";

const SLDFooter: React.FC = () => {
  const colorMode = useColorModeValue("light", "dark");
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  return (
    <>
      <div className={`sld-footer ${colorMode}-mode`}>
        {/* ================= ALARM SUMMARY ================= */}
        <div className="footer-section alarm-summary">
          <div className="footer-title">ALARM SUMMARY</div>

          <div className="alarm-box">
            <div className="alarm-item">
              <span className="alarm-count critical">12</span>
              <span className="alarm-label">CRITICAL</span>
            </div>

            <div className="alarm-item">
              <span className="alarm-count major">8</span>
              <span className="alarm-label">MAJOR</span>
            </div>

            <div className="alarm-item">
              <span className="alarm-count minor">5</span>
              <span className="alarm-label">MINOR</span>
            </div>

            <div className="alarm-item">
              <span className="alarm-count warning">23</span>
              <span className="alarm-label">WARNING</span>
            </div>
          </div>
        </div>

        {/* ================= LATEST ALARMS ================= */}
        <div className="footer-section latest-alarms">
          <div className="footer-title">LATEST ALARMS</div>

          <div className="alarm-table">
            <div className="alarm-row alarm-header">
              <span>TIME</span>
              <span>SEVERITY</span>
              <span>ALARM</span>
              <span>LOCATION</span>
              <span>STATUS</span>
            </div>

            <div className="alarm-row">
              <span>10:24:31</span>

              <span className="severity critical">
                <b>◆</b> CRITICAL
              </span>

              <span>PCS-23 : Over Temperature</span>

              <span>Block-2 / Feeder-7</span>

              <span className="status active">ACTIVE</span>
            </div>

            <div className="alarm-row">
              <span>10:24:18</span>

              <span className="severity major">
                <b>◆</b> MAJOR
              </span>

              <span>BESS-02 : High Temperature</span>

              <span>Block-1 / ICC-02</span>

              <span className="status active">ACTIVE</span>
            </div>

            <div className="alarm-row">
              <span>10:22:47</span>

              <span className="severity minor">
                <b>▲</b> MINOR
              </span>

              <span>T-1 : Oil Temperature High</span>

              <span>Transformer Bay-1</span>

              <span className="status active">ACTIVE</span>
            </div>
          </div>

          <button
            className="view-all-btn"
            type="button"
            onClick={() => setIsAlarmModalOpen(true)}
          >
            VIEW ALL ALARMS
          </button>
        </div>

        {/* ================= LEGEND ================= */}
        <div className="footer-section legend-section">
          <div className="footer-title">LEGEND</div>

          <div className="legend-grid">
            <div className="legend-column">
              <div className="legend-item">
                <span className="legend-symbol green-square" />
                <span>VCB Closed</span>
              </div>

              <div className="legend-item">
                <span className="legend-symbol red-square" />
                <span>VCB Open</span>
              </div>

              <div className="legend-item">
                <span className="legend-symbol red-cross">
                  ×
                </span>
                <span>VCB Tripped</span>
              </div>
            </div>

            <div className="legend-column">
              <div className="legend-item">
                <span className="legend-symbol spring-charged" />
                <span>Spring Charged</span>
              </div>

              <div className="legend-item">
                <span className="legend-symbol spring-discharged" />
                <span>Spring Discharged</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAlarmModalOpen && (
        <div
          className="alarm-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsAlarmModalOpen(false);
            }
          }}
        >
          <div
            className="alarm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-alarms-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="alarm-modal-header">
              <h2 id="all-alarms-title">ALL ALARMS</h2>
              <button
                className="alarm-modal-close"
                type="button"
                aria-label="Close alarms"
                onClick={() => setIsAlarmModalOpen(false)}
              >
                x
              </button>
            </div>

            <div className="alarm-modal-table alarm-table">
              <div className="alarm-row alarm-header">
                <span>TIME</span>
                <span>SEVERITY</span>
                <span>ALARM</span>
                <span>LOCATION</span>
                <span>STATUS</span>
              </div>

              <div className="alarm-row">
                <span>10:24:31</span>
                <span className="severity critical"><b>◆</b> CRITICAL</span>
                <span>PCS-23 : Over Temperature</span>
                <span>Block-2 / Feeder-7</span>
                <span className="status active">ACTIVE</span>
              </div>

              <div className="alarm-row">
                <span>10:24:18</span>
                <span className="severity major"><b>◆</b> MAJOR</span>
                <span>BESS-02 : High Temperature</span>
                <span>Block-1 / ICC-02</span>
                <span className="status active">ACTIVE</span>
              </div>

              <div className="alarm-row">
                <span>10:22:47</span>
                <span className="severity minor"><b>▲</b> MINOR</span>
                <span>T-1 : Oil Temperature High</span>
                <span>Transformer Bay-1</span>
                <span className="status active">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= INLINE CSS ================= */}
      <style>
        {`
          .sld-footer {
            position: fixed;
            left: 70px;
            right: 0;
            bottom: 0;

            height: 92px;

            display: flex;

            background: #020b14;
            border: 1px solid #142536;

            color: #d7e1eb;

            font-family: Arial, sans-serif;

            z-index: 1000;

            box-sizing: border-box;
          }

          .footer-section {
            position: relative;
            height: 100%;
            box-sizing: border-box;

            border-right: 1px solid #142536;
          }

          .footer-section:last-child {
            border-right: none;
          }

          .footer-title {
            position: absolute;

            top: 8px;
            left: 12px;

            font-size: 8px;
            font-weight: 600;

            color: #a9b6c3;

            letter-spacing: 0.5px;
          }

          /* ================= ALARM SUMMARY ================= */

          .alarm-summary {
            width: 27%;
            padding: 23px 12px 8px;
          }

          .alarm-box {
            height: 48px;

            display: flex;

            border: 1px solid #162b3e;
            border-radius: 4px;

            background: #04111d;
          }

          .alarm-item {
            flex: 1;

            display: flex;
            flex-direction: column;

            justify-content: center;
            align-items: center;

            border-right: 1px solid #142536;
          }

          .alarm-item:last-child {
            border-right: none;
          }

          .alarm-count {
            font-size: 16px;
            line-height: 18px;
            font-weight: 700;
          }

          .alarm-label {
            margin-top: 2px;

            font-size: 8px;

            color: #a8b3be;
          }

          .critical {
            color: #ff3b30;
          }

          .major {
            color: #ff9f0a;
          }

          .minor {
            color: #f5d900;
          }

          .warning {
            color: #61d5e8;
          }

          /* ================= LATEST ALARMS ================= */

          .latest-alarms {
            width: 53%;

            padding: 22px 105px 5px 20px;
          }

          .alarm-table {
            width: 100%;
          }

          .alarm-row {
            display: grid;

            grid-template-columns:
              58px
              100px
              220px
              150px
              55px;

            height: 15px;

            align-items: center;

            font-size: 8px;

            white-space: nowrap;
          }

          .alarm-header {
            height: 13px;

            color: #8c9aaa;

            font-size: 7px;
          }

          .alarm-row span {
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .severity {
            font-size: 8px;
          }

          .severity b {
            margin-right: 4px;
            font-size: 8px;
          }

          .status {
            font-weight: 600;
          }

          .status.active {
            color: #ff9f0a;
          }

          .view-all-btn {
            position: absolute;

            right: 18px;
            bottom: 20px;

            height: 20px;
            padding: 0 10px;

            border: 1px solid #1d3850;
            border-radius: 3px;

            background: #061522;

            color: #67b8e8;

            font-size: 7px;
            font-weight: 600;

            cursor: pointer;
          }

          .view-all-btn:hover {
            background: #0a2032;
          }

          /* ================= LEGEND ================= */

          .legend-section {
            width: 20%;

            padding: 24px 12px 8px;
          }

          .legend-grid {
            display: flex;
            gap: 35px;
          }

          .legend-column {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .legend-item {
            display: flex;

            align-items: center;

            gap: 8px;

            font-size: 8px;

            color: #b7c1cb;

            white-space: nowrap;
          }

          .legend-symbol {
            width: 7px;
            height: 7px;

            display: inline-flex;

            align-items: center;
            justify-content: center;

            box-sizing: border-box;
          }

          .green-square {
            background: #8bc34a;
            border: 1px solid #a5d66b;
          }

          .red-square {
            background: #d83232;
            border: 1px solid #f04b4b;
          }

          .red-cross {
            color: #ff3030;
            font-size: 17px;
            font-weight: bold;
            line-height: 7px;
          }

          .spring-charged {
            width: 7px;
            height: 7px;
            border-radius: 50%;

            background: #69d54c;
          }

          .spring-discharged {
            width: 7px;
            height: 7px;
            border-radius: 50%;

            background: transparent;
            border: 1px solid #69d54c;
          }

          .alarm-modal-overlay {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: rgba(0, 0, 0, 0.55);
            z-index: 1100;
          }

          .alarm-modal {
            width: min(760px, 100%);
            padding: 20px;
            background: #020b14;
            border: 1px solid #284258;
            border-radius: 6px;
            color: #d7e1eb;
            box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
            box-sizing: border-box;
          }

          .alarm-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
          }

          .alarm-modal-header h2 {
            margin: 0;
            font-size: 14px;
            letter-spacing: 0.4px;
          }

          .alarm-modal-close {
            width: 28px;
            height: 28px;
            padding: 0;
            border: 1px solid #38536a;
            border-radius: 3px;
            background: transparent;
            color: #d7e1eb;
            font-size: 16px;
            line-height: 1;
            cursor: pointer;
          }

          .alarm-modal-close:hover {
            background: #123047;
          }

          .alarm-modal-table .alarm-row {
            width: 100%;
            grid-template-columns: 72px 110px minmax(180px, 1fr) 150px 60px;
          }

          .sld-footer.light-mode + .alarm-modal-overlay .alarm-modal {
            background: #ffffff;
            border-color: #c9d7e3;
            color: #243447;
          }

          .sld-footer.light-mode + .alarm-modal-overlay .alarm-modal-close {
            border-color: #b9c9d6;
            color: #243447;
          }

          .sld-footer.light-mode + .alarm-modal-overlay .alarm-modal-close:hover {
            background: #eef5fb;
          }

          @media (max-width: 700px) {
            .alarm-modal {
              overflow-x: auto;
            }

            .alarm-modal-table {
              min-width: 600px;
            }
          }

          .sld-footer.light-mode {
            background: #ffffff;
            border-color: #d7e0e8;
            color: #243447;
          }

          .sld-footer.light-mode .footer-section {
            border-right-color: #d7e0e8;
          }

          .sld-footer.light-mode .footer-title {
            color: #526273;
          }

          .sld-footer.light-mode .alarm-box {
            background: #f4f7fa;
            border-color: #d7e0e8;
          }

          .sld-footer.light-mode .alarm-item {
            border-right-color: #d7e0e8;
          }

          .sld-footer.light-mode .alarm-label,
          .sld-footer.light-mode .legend-item {
            color: #526273;
          }

          .sld-footer.light-mode .alarm-header {
            color: #6b7b8c;
          }

          .sld-footer.light-mode .view-all-btn {
            background: #eef5fb;
            border-color: #b9d2e5;
            color: #17608d;
          }

          .sld-footer.light-mode .view-all-btn:hover {
            background: #deedf8;
          }
        `}
      </style>
    </>
  );
};

export default SLDFooter;