import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../Components/CustomTable";
import Select from "react-select";
import { InputField } from "../../Components/InputField/InputField";
import axios from "../../utils/axios";
import { useLocation, useParams } from "react-router-dom";

interface SearchStudentsProps {
  isEdit: boolean;
}

export const ListStudents = ({ isEdit }: SearchStudentsProps) => {
  const [roll, setRoll] = useState("");
  const navigate = useNavigate();
  const location: any = useLocation();
  const [uniqueid, setuniqueid] = useState(location.state?.rollNumber ?? "");
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [name, setName] = useState(location.state?.name ?? "");
  const [phone, setPhone] = useState(location.state?.phone ?? "");
  const [uniqueidError, setUniqueidError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [nameError, setNameError] = useState<string>();
  const [selectYear, setSelectYear] = useState(location.state?.year ?? null);
  const [selectDepartment, setSelectDepartment] = useState(
    location.state?.branch ?? null
  );
  const [selectSection, setSelectSection] = useState(
    location.state?.section ?? null
  );
  const [selectCourse, setSelectCourse] = useState(null);

  const [courses, setCourses] = useState<any>([{value:null, label:"Any"}]);
  const [departments, setDepartments] = useState<any>([{value:null, label:"Any"}]);
  const [yearList, setYearList] = useState<any>([{value:null, label:"Any"}]);
  const [sections, setSections] = useState<any>([{value:null, label:"Any"}]);
  let { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}students/getCourses`)
      .then((resp: any) => {
        setCourses([...courses,
          resp.data.response.map((c: any) => {
            return { value: c, label: c };
          })].flat()
        );
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}students/getBranches/${selectCourse}`
      )
      .then((resp: any) => {
        console.log(resp);
        setDepartments(
          [...departments,
            resp.data.response.map((c: any) => {
              return { value: c, label: c };
            })].flat()
        );
        return axios.get(
          `${process.env.REACT_APP_SERVER_URL}students/getTotalYears/${selectCourse}`
        );
      })
      .then((yrs: any) => {
        console.log(yrs);
        const y = [];
        for (let i = 1; i <= yrs.data.response; i++)
          y.push({ value: i, label: i });
        setYearList([{value:null, label:"Any"},...y]);
      });
  }, [selectCourse]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}students/getTotalSections/${selectCourse}/${selectDepartment}`
      )
      .then((response) => {
        const totalSections = Number(response.data.response);
        let y = [];
        let abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
        for (let i = 0; i < totalSections; i++)
          y.push({ value: abc[i], label: abc[i] });
        setSections([{value:null,label:"Any"},...y]);
      });
  }, [selectDepartment]);

  const validateUniqueid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uniqueid = e.target.value;
    setuniqueid(uniqueid);
    var rollNumber = uniqueid.toUpperCase();
    let rollRegex = new RegExp(
      /^(18|19|20|21)(p6|p5)(1|5)(a|A)(01|02|03|04|05|12|56|62|66|67|69|70)[(a-z)|(0-9)][0-9]$/i
    );
    if (rollNumber.length === 0) {
      setUniqueidError("roll number cannot be empty");
    } else if (rollNumber.length < 10) {
      setUniqueidError("roll number cannot be less than 10 characters");
    } else if (rollNumber.length > 10) {
      setUniqueidError("roll number cannot exceed 10 characters");
    } else if (!rollRegex.test(rollNumber)) {
      setUniqueidError("roll number invalid");
    } else {
      setUniqueidError("");
    }
  };

  const validateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    if (name.length === 0) {
      setNameError("Name field is empty");
    } else {
      setNameError("");
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex flex-col mt-5 sm:mx-5 mx-5 space-y-5">
          <div className="grid grid-cols-2">
            <div>
              <p className="text-arma-title mb-5 text-4xl">Students</p>
            </div>
            <div>
              <button
                className="btn  bg-arma-title rounded-[8px] px-6 py-2 ml-auto flex"
                onClick={() => navigate("/Students/AddStudents")}
              >
                Add Student
              </button>
            </div>
          </div>

          {/* <button className="btn" onClick = {() => navigate('/Students/EditStudents')}>EDIT</button> */}

          <div className="flex flex-col gap-y-6 mb-6  md:flex-row sm:gap-x-8">
            <InputField
              name="Search by name"
              type="text"
              error={nameError}
              onChange={(e) => {
                setName(name);
                validateName(e);
              }}
            />

            <InputField
              name="Search by roll number"
              type="text"
              error={uniqueidError}
              onChange={(e) => {
                setRoll(e.target.value);
                validateUniqueid(e);
              }}
            />

            
            <Select
              name="Course"
              placeholder="Course"
              options={courses}
              onChange={(e: any) => {
                setSelectCourse(e?.value);
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 52,
                  minWidth: 150,
                  borderRadius: "0.5rem",
                  border: "2px solid rgb(200, 200, 200)",
                }),
                placeholder: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                }),
                singleValue: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                  color: "black",
                }),
              }}
              className="basic-multi-select"
            />
            <Select
            isDisabled={selectCourse == null}
              name="Year"
              placeholder="Year"
              options={yearList}
              onChange={(e: any) => {
                setSelectYear(e?.value);
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 52,
                  minWidth: 150,
                  borderRadius: "0.5rem",
                  border: "2px solid rgb(200, 200, 200)",
                }),
                placeholder: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                }),
                singleValue: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                  color: "#black",
                }),
              }}
              className="basic-multi-select"
            />
            <Select
                        isDisabled={selectCourse == null}

              name="Branch"
              placeholder="Branch"
              options={departments}
              onChange={(e: any) => {
                setSelectDepartment(e?.value);
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 52,
                  minWidth: 150,
                  borderRadius: "0.5rem",
                  border: "2px solid rgb(200, 200, 200)",
                }),
                placeholder: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                }),
                singleValue: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                  color: "black",
                }),
              }}
              className="basic-multi-select"
            />
{console.log("selectDepart is now ", selectDepartment)}
            <Select
              isDisabled={selectCourse == null || selectDepartment == null}
              name="Section"
              placeholder="Section"
              options={sections}
              onChange={(e: any) => {
                setSelectSection(e?.value);
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 52,
                  minWidth: 150,
                  borderRadius: "0.5rem",
                  border: "2px solid rgb(200, 200, 200)",
                }),
                placeholder: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                }),
                singleValue: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                  color: "black",
                }),
              }}
              className="basic-multi-select"
            />
          </div>

          <Table
            api={`${process.env.REACT_APP_SERVER_URL + "students"}`}
            rowsPerPage={5}
            buttonsCount={3}
            filter={{
              rollNumber: roll,
              name: name,
              branch: selectDepartment,
              course: selectCourse,
              year: selectYear,
              section: selectSection,
            }}
            onTableRowClick={(id) => navigate(`/Students/EditStudents/${id}`)}
            headers={[
              {
                displayName: "ROLL.NO",
                dataPath: "rollNumber",
                sortable: true,
              },
              { displayName: "NAME", dataPath: "name", sortable: true },
              { displayName: "YEAR", dataPath: "year", sortable: true },
              { displayName: "COURSE", dataPath: "course", sortable: false },
              { displayName: "BRANCH", dataPath: "branch", sortable: false },
              { displayName: "SECTION", dataPath: "section", sortable: false },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
