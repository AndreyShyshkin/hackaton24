import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import CreateList from "../../components/CreateList";

function Project() {
  const [user, setUser] = useState(null);
  const [projectStatus, setProjectStatus] = useState({
    exists: null,
    member: null,
  });
  const auth = getAuth();
  const database = getDatabase();
  const urlParams = new URLSearchParams(window.location.search);
  const teamName = urlParams.get("teamname");
  const projectName = urlParams.get("projectname");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        checkProjectStatus(currentUser.uid);
      } else {
        setUser(null);
        navigate("/auth");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, navigate]);

  const checkProjectStatus = async (userId) => {
    if (!teamName) {
      setProjectStatus({ exists: false, member: false });
      return;
    }

    const projectRef = ref(
      database,
      `teams/${teamName}/projects/${projectName}/`,
    );
    try {
      const snapshot = await get(projectRef);
      if (snapshot.exists()) {
        const teamData = snapshot.val();
        const isMember = teamData.users && teamData.users[userId];
        setProjectStatus({ exists: true, member: Boolean(isMember) });
      } else {
        setProjectStatus({ exists: false, member: false });
      }
    } catch (error) {
      console.error("Error checking team status:", error);
      setProjectStatus({ exists: null, member: null });
    }
  };

  return (
    <div>
      {user ? (
        projectStatus.exists === null ? (
          <span>Loading...</span>
        ) : projectStatus.exists === false ? (
          <span>Проекта не существует</span>
        ) : projectStatus.member === false ? (
          <span>Вы не состоите в этом проекте</span>
        ) : (
          <div>
            <span>
              {" "}
              {user.displayName} Добро пожаловать в команду {teamName} вы
              работаетаете над проектом {projectName}
            </span>
            <Link to={`/team?name=${teamName}`}>Выбрать другой проект</Link>
            <CreateList />
          </div>
        )
      ) : (
        <span>Переадресация...</span>
      )}
    </div>
  );
}

export default Project;
