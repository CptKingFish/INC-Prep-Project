import { useState } from "react";

const Management = () => {
  const [state, setState] = useState({
    users: [],
    loading: true,
  });

  return (
    <div>
      <h1>Management</h1>
      <p>The Management Page is accessible by every signed in admin.</p>
      {state.loading && <div>Loading ...</div>}
    </div>
  );
};

export default Management;
