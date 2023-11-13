import React from "react";
import { Card, Alert, Input, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getUpdateContent } from "utils/DocsApi";

import WriteForm from "components/Write/WriteDocs";
import ImageUpload from "components/Write/ImageUpload";
import DocsNav from "./DocsNav";

import { openNotification } from "App";
import { updateDocs } from "utils/DocsApi";

import styles from "./Content.module.css";

const { TextArea } = Input;
const Edit = () => {
  const params = useParams();
  const [loading, setLoading] = React.useState(false);
  const [id, setDocsId] = React.useState();
  const [errmsg, setErrMsg] = React.useState("");
  const [content, setContent] = React.useState();
  const [title, setTitle] = React.useState();
  const [classes, setClasses] = React.useState([]);
  const [modifyCnt, setModifyCnt] = React.useState(0);
  const navigate = useNavigate();
  const [disabled, setDisabled] = React.useState("");
  const [revisionId, setRevisionId] = React.useState(0);

  const [comment, setComment] = React.useState("");

  const [conflict, setConflict] = React.useState(false);
  const [topRevId, setTopRevId] = React.useState();
  const { error } = Modal;

  // 처음 랜더링시 내용과 권한 가져오기
  React.useEffect(() => {
    getUpdateContent(params.docsId).then((response) => {
      console.log(response);
      setContent(response.content);
      setTitle(response.title);
      setClasses(response.categoryList);
      setDocsId(response.docsId);
      setRevisionId(response.revId);

      setLoading(true);

      // 권한이 있으면 수정가능
      //없으면 에러메세지
      if (!response.canUpdate) {
        setDisabled("disabled");
        setErrMsg("해당 문서의 수정 권한이 없습니다.");
      }
    });

    // redis에서 수정중인사람 있는지 가져오기
    setModifyCnt(0);
  }, [params]);

  const handlemodify = () => {
    // conflict가 true이면 충돌난 부분 수정을 했는지 content내용 검사가 필요
    if (
      conflict &&
      (content.includes("`<<<<<< HEAD`") ||
        content.includes("`======`") ||
        content.includes("`>>>>>>> PATCH`"))
    ) {
      error({
        title: "수정이 완료되지 않았습니다.",
      });
    } else {
      // axios로 등록 데이터 넣어줘야함
      console.log(comment);
      updateDocs({
        docsId: id,
        content: content,
        categories: classes,
        revId: revisionId,
        topRevId: topRevId,
        comment: comment,
      })
        .then((result) => {
          //완료
          console.log(result);
          openNotification(
            "success",
            "문서수정 완료",
            `${result.title}문서가 수정되었습니다.`
          );

          navigate(`/res/content/${result.docsId}/${result.title}`);
        })
        .catch((err) => {
          // console.log(err.response);
          if (err.response.status == 409) {
            error({
              title: "버전 충돌",
              content: (
                <>
                  <p>{"`<<<<<< HEAD`"}</p>
                  <p>{"`======`"}</p>
                  <p>{"`>>>>>>> PATCH`"}</p>
                  <p>사이의 내용이 충돌났습니다.</p>
                </>
              ),
            });

            setContent(err.response.data.content);
            setConflict(true);
            setTopRevId(err.response.data.topRevId);
          }
        });
    }
  };

  return (
    <div>
      <div className={styles.contentTitle}>
        <h1 className={styles.title}>
          {params.title}{" "}
          <small style={{ fontWeight: "normal" }}>(문서 수정)</small>
        </h1>
      </div>
      <Card>
        {errmsg === "" ? (
          <></>
        ) : (
          <Alert type="error" message={errmsg} showIcon />
        )}
        {loading ? (
          <WriteForm
            title={title}
            content={content}
            setContent={setContent}
            disabled={disabled}
            button="수정"
            completeLogic={handlemodify}
            selectedClass={classes}
            setSelectedClass={setClasses}
          />
        ) : (
          <></>
        )}

        {!disabled ? (
          <TextArea
            placeholder="comment"
            rows={4}
            defaultValue={comment}
            autoSize={{
              minRows: 4,
            }}
            onChange={(value) => {
              // console.log(value);
              setComment(value.target.value);
            }}
          />
        ) : (
          <></>
        )}

        {!disabled ? <ImageUpload /> : <></>}
      </Card>
    </div>
  );
};

export default Edit;