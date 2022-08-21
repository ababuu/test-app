import React from "react";
import { Formik, useFormikContext } from "formik";
import Radio from "./components/Radio";
import Checkbox from "./components/Checkbox";
import "./css/Checkbox.css";
import useFetch from "./hooks/useFetch";
import * as Yup from "yup";
import useSearch from "./hooks/useSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import formatResource from "./helpers/formatResource";

export default function FormComponent() {
  const { data } = useFetch("resource.json");
  const [grouped, setGrouped] = React.useState({});
  const [allChecked, setAllChecked] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notFound, setNotFound] = React.useState(false);
  const searchResult = useSearch(searchQuery, data);

  React.useEffect(() => {
    setGrouped(formatResource(data));
  }, [data]);
  React.useEffect(() => {
    isAllSelected();
  }, [grouped]);
  React.useEffect(() => {
    if (searchQuery !== "") {
      setGrouped(formatResource(searchResult));
      if (searchResult.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    } else if (searchQuery === "") {
      setGrouped(formatResource(data));
      setNotFound(false);
    }
  }, [searchQuery]);

  const SetApplicableItems = () => {
    const { values, setFieldValue } = useFormikContext();
    let clicked = [];
    React.useEffect(() => {
      Object.keys(grouped).map((key) => {
        grouped[key].map((value) => {
          if (value.checked === true && !clicked.includes(value.id))
            clicked.push(value.id);
        });
      });
      setFieldValue("applicable_items", clicked);
    }, [grouped]);
    return null;
  };
  //checks or unchecks the check all checkbox
  const handleCheckAll = (e, key, clicked) => {
    const { checked } = e.target;
    let newArray = [...grouped[key]];
    if (!checked) {
      newArray = newArray.map((opt) => ({
        ...opt,
        checked: false,
      }));
    } else {
      newArray = newArray.map((opt) => ({
        ...opt,
        checked: true,
      }));
    }
    if (clicked === "radio") {
      newArray = newArray.map((opt) => ({
        ...opt,
        checked: true,
      }));
    }
    setGrouped((g) => ({ ...g, [key]: newArray }));
  };

  //checks or unchecks a single checkbox
  const handleCheckOne = (e, key, id) => {
    const { checked } = e.target;
    const newArray = [...grouped[key]];
    const index = newArray.findIndex((h) => h.id === id);
    if (index > -1) {
      newArray[index] = { ...newArray[index], checked: checked };
    }
    setGrouped((h) => ({ ...h, [key]: newArray }));
  };

  //for the check all radio
  const isAllSelected = () => {
    let all = [];
    Object.keys(grouped).map((key) => {
      grouped[key].map((val) => {
        if (val.checked === true) {
          all.push(val.id);
        }
        if (all.length === data.length) {
          setAllChecked(true);
        } else {
          setAllChecked(false);
        }
      });
    });
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Formik
        initialValues={{
          applicable_items: [],
          applied_to: "",
          name: "",
          rate: 5,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(),
          rate: Yup.number().required(),
          applicable_items: Yup.array().of(Yup.number()),
        })}
        onSubmit={(values) => {
          setTimeout(() => {
            alert(
              JSON.stringify(
                {
                  ...values,
                  rate: values.rate / 100,
                  applied_to: allChecked ? "all" : "some",
                },
                null,
                2
              )
            );
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="tax-input-container">
              <div className="name-container">
                <input
                  type="text"
                  name="name"
                  className={`input name ${
                    errors.name && touched.name && "error"
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="Tax Name"
                />
              </div>

              <div className="rate-container">
                <span className="rate-icon">%</span>
                <input
                  type="number"
                  name="rate"
                  className={`input rate ${
                    errors.rate && touched.rate && "error"
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.rate}
                  placeholder="Tax Value"
                />
              </div>
            </div>
            <div>
              <Radio
                id="all"
                label="Apply to all items in collection"
                handleChange={(e) => {
                  handleChange(e);
                  isAllSelected();
                  Object.keys(grouped).map((key) => {
                    handleCheckAll(e, key, "radio");
                  });
                }}
                value="all"
                checked={allChecked}
              />
              <Radio
                id="some"
                label="Apply to specific items"
                handleChange={(e) => {
                  handleChange(e);
                  setAllChecked(false);
                }}
                value="some"
                checked={!allChecked}
              />
            </div>
            <hr />
            <div className="search-container">
              <FontAwesomeIcon
                className="search-icon"
                icon={faMagnifyingGlass}
              />
              <input
                type="text"
                name="search"
                className="input search"
                onChange={(e) => {
                  handleSearch(e);
                  setFieldValue("applicable_items", []);
                }}
                onBlur={handleBlur}
                value={searchQuery}
                placeholder="Search Items"
              />
            </div>
            {!notFound ? (
              <>
                <div className="checkbox-container">
                  {Object.keys(grouped).map(function (key, index) {
                    return (
                      <div key={index}>
                        {grouped[key].length !== 0 && (
                          <div className="catagory-checkbox-container">
                            <Checkbox
                              id={key}
                              label={key}
                              checked={grouped[key].every((opt) => opt.checked)}
                              name="select_all"
                              onChange={(e) => {
                                handleChange(e);
                                handleCheckAll(e, key);
                              }}
                            />
                          </div>
                        )}
                        {grouped[key].map(function (item, index) {
                          return (
                            <div
                              key={index}
                              className="inner-checkbox-container"
                            >
                              <Checkbox
                                value={Number(item.id)}
                                id={item.id}
                                label={item.name}
                                name="applicable_items"
                                checked={item.checked}
                                onChange={(e) => {
                                  handleChange(e);
                                  handleCheckOne(e, key, item.id);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div className="apply-btn-container">
                  <button
                    className="apply-btn"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Apply tax to {values.applicable_items.length} item(s)
                  </button>
                </div>
              </>
            ) : (
              <div className="not-found">No Items Found</div>
            )}
            <SetApplicableItems />
          </form>
        )}
      </Formik>
    </>
  );
}
