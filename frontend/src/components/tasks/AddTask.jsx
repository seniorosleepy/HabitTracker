function AddTask({ tasksCount }) {
  return (
    <div className="wrapper">
      <div className="main-title-container">
        <h1 className="main-task-title">Tasks</h1>
        <div className="add-task-container">
          {tasksCount !== 0 && <h3>Total tasks : {tasksCount}</h3>}
        </div>
      </div>
    </div>
  );
}

export default AddTask;
