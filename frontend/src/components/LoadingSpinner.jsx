
const LoadingSpinner = () => {
  return (
    <>
      <style>{`
        .spinner-backdrop {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #121212; /* bg-gray-900 */
        }

        .spinner-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .spinner-track {
          width: 80px;
          height: 80px;
          border: 2px solid #A7F3D0; /* emerald-200 */
          border-radius: 50%;
        }

        .spinner-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
          border: 4px dotted #10B981; /* emerald-500 */
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="spinner-backdrop">
        <div className="spinner-wrapper">
          <div className="spinner-track"></div>
          <div className="spinner-ring"></div>
          <span className="sr-only">Loading</span>
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
