import React, { useContext, useEffect, useState } from "react";
import FormBuilderTheme from "../components/formbuilder/FormBuilderTheme";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AuthContext";
import { getFormById } from "../api/api";
import DynamicSurvey from "../components/publishedForm/DynamicSurvey";
import { SAMPLE_SURVEY_FORM } from "../constants/formConstants.js";
import { RxArrowLeft } from "react-icons/rx";
import { MdErrorOutline } from "react-icons/md";
import ExpiredFormUI from "../components/ExpiredFormUI";
import LoginRequiredUI from "../components/LoginRequiredUI";

const PublishedSingleForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(SAMPLE_SURVEY_FORM);
  // const [response, setResponse] = useState({});
  // console.log("id", id);

  const { token } = useContext(AppContext);
  const authToken = localStorage.getItem("token") || token;

  // const isFormExpired = response?.expiresAt < new Date().toISOString();
  // const loginRequired = response?.loginRequired;
  const isFormExpired = null;
  const loginRequired = null;


  // useEffect(() => {
  //   // Fetch the single published form data using the id from params
  //   const fetchData = async () => {
  //     const response = await getFormById(id, authToken);
  //     setForm(response.data?.data);
  //     setResponse(response?.data);
  //   };

  //   fetchData();
  // }, [id, authToken]);

  console.log("form from api", form);
  // console.log("response from api", response);

  // console.log("form.name", form.name);
  // console.log("new Date().toISOString()", new Date().toISOString());
  // console.log("response?.expiresAt", response?.expiresAt);
  // console.log("isFormExpired", isFormExpired);
  // console.log("loginRequired", loginRequired);

  // {
  //   isFormExpired ? (
  //     console.log("isFormExpired", isFormExpired)
  //   ) : loginRequired && !authToken ? (
  //     console.log("loginRequired && !authToken", loginRequired && !authToken)
  //   ) : (
  //     console.log("rendering DynamicSurvey")
  //   )
  // }

  return (
    <FormBuilderTheme>
      <div className="min-h-[71vh] bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 flex justify-center">
        {isFormExpired ? (
          <ExpiredFormUI />
        ) : loginRequired && !authToken ? (
          <LoginRequiredUI />
        ) : (
          // form && <DynamicSurvey form={form} authToken={authToken} />
          // form && form.length > 0 && <DynamicSurvey form={form} authToken={authToken} />
          <DynamicSurvey form={form} authToken={authToken} setForm={setForm} />
        )}
        {/* <DynamicSurvey form={form} authToken={authToken} /> */}
      </div>
    </FormBuilderTheme>
  );
};

export default PublishedSingleForm;
