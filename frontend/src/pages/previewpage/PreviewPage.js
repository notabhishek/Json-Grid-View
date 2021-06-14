import "./PreviewPage.css";
import "./dataframeStyle.css";
import { Container, Row, Col, Pagination, PageItem } from "react-bootstrap";
import FileUrlLayout from "../../components/fileurllayout/FileUrlLayout";
import Button from "../../components/button/Button";
import IconBox from "../../components/iconbox/IconBox";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { DataGrid } from '@material-ui/data-grid';
// import { useDemoData } from '@material-ui/x-grid-data-generator';
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Pagination from '@material-ui/lab/Pagination';
import Navbar from "../../components/navbar/Navbar";
import "../../components/scrollbar/ScrollBar.css";
import { useHistory } from "react-router";
import initialDataFrame from "../../global_variable";
import { PaginationItem } from "@material-ui/lab";
import PaginationP from "../../components/pagination/Pagination";
import Switch from "@material-ui/core/Switch";
import ListR from "react-list-select";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SelectedValues from "../../components/selectedvaluespreview/SelectedValues";
import IOSSwitch from "../../material-styles";
import Checkbox from "@material-ui/core/Checkbox";

var FileDownload = require("js-file-download");
var parse = require("html-react-parser");

// style 
const useStyles = makeStyles((theme) => ({
  // root: {
  //   "& > *": {
  //     marginTop: theme.spacing(2),
  //   },
  //   width: "40%",
  //   backgroundColor: "white",
  //   marginLeft: "30%",
  //   marginRight: "30%",
  // },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  num: {
    // color:'black',
    // backgroundColor:'#00b0ff',
    marginLeft: "36%",
    marginRight: "30%",
    padding: "2%",
  },
}));

const PreviewPage = (props) => {
  const classes = useStyles();
  let  [,setState]=useState();
  console.log("preview pageeeeeee");
  // props containd top 20 rows and total pages
  // const location = useLocation();
  // console.log(location.state.state.df);

  
  const [downloadContent, setDownloadContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [table, setTable] = useState(initialDataFrame.df);
  const [formDisplay, setFormDisplay] = useState(false);


  // function to download file
  const handleConversion = (val) => {
    const formData = new FormData();
    formData.set("content_type", val);
    if (val == "excel") {
      setFileExtension("output.xlsx");
    } else if (val == "csv") {
      setFileExtension("output.csv");
    } else {
      setFileExtension("output.db");
    }
    axios
      .post("http://localhost:5000/api/convert", formData, {
        responseType: "blob",
      })
      .then((response) => {
        setUploadPercentage(100);
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);
        setDownloadContent(response.data);
        console.log(response);
        setShowDownload(true);
      })
      .catch((err) => {
        console.log(err);
        setUploadPercentage(0);
      });
  };

  // download content
  const downloadFile = () => {
    FileDownload(downloadContent, fileExtension);
  };

  // on 
  // const pagehandler = (number) => {
  //   console.log(number);
  // };

  // toggle switch for showing form
  const switchhandler = () => {
    if (formDisplay) {
      setFormDisplay(false);
    } else {
      setFormDisplay(true);
    }
  };

  // let active = 2;
  // let items = [];
  // for (let number = 1; number <= 5; number++) {
  //   items.push(
  //     <PaginationItem
  //       className={classes.num}
  //       shape="round"
  //       size="large"
  //       color="secondary"
  //       type="page"
  //       page={number}
  //       active={number === active}
  //       onClick={() => pagehandler(number)}
  //     >
  //       {number}
  //     </PaginationItem>
  //   );
  // }
  const dictIntermediate ={};
  for (var i = 0; i < initialDataFrame.cols.length; i++) {
    dictIntermediate[initialDataFrame.cols[i]] = new Set();
  }
  let [dict, setDict] = useState(dictIntermediate);
 
  // index to get col name 
  const [selectedIndex, setSelectedIndex] = useState(1);
  let colWithIdx = [];
  const handleListItemClick = (event, index) => {
    console.log(colWithIdx[index]);
    const newdict =  dict;
    newdict[colWithIdx[index]].add("adti");
    setDict(newdict);
    console.log(dict);
    console.log(index);
    setSelectedIndex(index);
    const formData = new FormData();
    formData.set("col_name", colWithIdx[index]);
    formData.set("page_number", 1);
    axios
      .post("http://localhost:5000/api/uniqueValues", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
        
      });
  };

  // create list to display all columns
  let colList = [];

  for (var i = 0; i < initialDataFrame.cols.length; i++) {
    dictIntermediate[initialDataFrame.cols[i]] = new Set();
    
    let number = i;
    colWithIdx[number] = initialDataFrame.cols[i];
    colList.push(
      <ListItem
        button
        selected={selectedIndex === number}
        onClick={(event) => handleListItemClick(event, number)}
      >
        <ListItemText className="textList" primary={initialDataFrame.cols[i]} />
      </ListItem>
    );
  }

  // create list to display unique values of column
  let valueList = [];
  var [val, setVal] = useState([]);
  const values = ['aditi', 'aditya','abhishek', 'ashish', 'neha', 'prakriti'];
  const initCheck =new Array(values.length).fill(false);
  const [check,setCheck] = useState(initCheck);

  //  setDict(dictIntermediate);


  const handleValueToggle  = (event, num) =>{
    
    console.log(event.target.value)
    console.log("value" + values[num]);
    const newcheck = check;
     
    console.log("selectedcol" + colWithIdx[selectedIndex]);
    if(newcheck[num]){
      newcheck[num]=false;
    }
    else{
      newcheck[num]=true;
    }
    // console.log(initCheck)
    setCheck(newcheck);
    setState({});
    console.log(check);
    // setCheck(!check);
  };


  for (var i = 0; i < values.length; i++) {
    let number = i;
    
    valueList.push(
      <ListItem key={values[number]} role={undefined}  dense button onClick={(event) => handleValueToggle(event, number)}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={check[number]}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemText  primary={values[number]} />
    </ListItem>
    );
  };

 


  const onPageChanged = (data) => {
    // const { allCountries } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    console.log(currentPage);
    const offset = (currentPage - 1) * pageLimit;
    const formData = new FormData();
    formData.set("page_number", currentPage);
    axios
      .post("http://localhost:5000/api/page", formData)
      .then((response) => {
        console.log(response);
        setTable(response.data.table);
      })
      .catch((err) => {
        console.log(err);
      });

    // const currentCountries = allCountries.slice(offset, offset + pageLimit);

    // this.setState({ currentPage, currentCountries, totalPages });
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="previewpage">
        <div className="preview ">
          <Container className="display scrollbar scrollbar-secondary  ">
            <div dangerouslySetInnerHTML={{ __html: table }} />
            {/* <div id="tableDisplay">
                parse(location.state.state.df);
          </div> */}
          </Container>
        </div>
        <div className={classes.num}>
          <PaginationP
            totalRecords={initialDataFrame.records}
            pageLimit={initialDataFrame.rows}
            pageNeighbours={1}
            onPageChanged={onPageChanged}
          />
        </div>
        <div className="formtoggle">
          <h5>Toggle the switch to perform query on data</h5>
          {/* <Switch className="formswitch"
            checked={formDisplay}
            onChange={switchhandler}
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
          /> */}
          <FormControlLabel
            className="formswitch"
            control={
              <IOSSwitch
                checked={formDisplay}
                onChange={switchhandler}
                name="checkedB"
              />
            }
          />
        </div>

        {formDisplay ? (
          <>
            <SelectedValues dict={dict}></SelectedValues>
            <Row className="fullform">
              <Col lg="4">
              <h5>Select Column</h5> 
              <div className="colList">
              
              <Divider />
              <List component="nav" aria-label="secondary mailbox folder">
                {colList}
              </List>
            </div>
              </Col>
              <Col lg="4">
              <h5>Select Values</h5> 
              <div className="colList">
              
              <Divider />
              <List component="nav" aria-label="secondary mailbox folder">
                {valueList}
                
              </List>
            </div>
            <div className={classes.num}>
          <PaginationP
            totalRecords={40}
            pageLimit={4}
            pageNeighbours={1}
            onPageChanged={onPageChanged}
          />
        </div>
              </Col>
            </Row>
            
          </>
        ) : (
          <p></p>
        )}
        <Container>
          <h3>SELECT A CATEGORY {props.totalPages}</h3>
          <Row>
            <Col lg="4">
              <IconBox iconType={faFileExcel} size={"2x"}></IconBox>
              <Button
                title={"Convert to Excel"}
                classId={"uploadButton"}
                clickFunc={() => handleConversion("excel")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faFileCsv} size={"2x"}></IconBox>
              <Button
                title={"Convert To CSV"}
                classId={"uploadButton"}
                clickFunc={() => handleConversion("csv")}
              ></Button>
            </Col>
            <Col lg="4">
              <IconBox iconType={faDatabase} size={"2x"}></IconBox>
              <Button
                title={"Save to Hive"}
                classId={"uploadButton"}
                clickFunc={() => handleConversion("hive")}
              ></Button>
            </Col>
          </Row>
        </Container>
        {showDownload ? (
          <Button
            title={"Download"}
            classId={"downloadButton"}
            clickFunc={downloadFile}
          ></Button>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
};

export default PreviewPage;