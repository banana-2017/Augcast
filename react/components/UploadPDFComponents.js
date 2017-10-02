

class UploadButton extends React.Component {
    constructor(props) {
        super(props);

        // initial states
        this.state = {};
    }

    render() {
        var that = this;
        return (
            <div className="status-button">
                <TooltipButton icon='cloud_upload'
                               className="upload-button"
                               tooltip="Upload slides for this lecture"
                               tooltipPosition="right"
                               onClick={() => {that.props.onClick(that.props.iconLecture);}} />
            </div>
        );
    }
}

class DoneMark extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var that = this;
        return (
            <div className="status-button">
                <TooltipButton icon="done"
                               className="done-mark"
                               tooltip="Slides successfully synced!"
                               tooltipPosition="right"
                               onClick={() => {that.props.onClick(that.props.iconLecture);}}/>
            </div>
        );
    }
}

class LabelingProgressChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var that = this;
        return (
            <div className="status-button">
                <TooltipButton icon='cached'
                               className="upload-button"
                               tooltip={'Progress: ' + that.props.progress + '%'}
                               tooltipPosition="right"
                               onClick={() => {that.props.onClick(that.props.iconLecture);}} />
            </div>
        );
    }
}

class UploadIconController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // Store reference to database listener so it can be removed
        var that = this;
        var course = this.props.iconCourse;
        var lecture = this.props.iconLecture;

        if (course != undefined && lecture != undefined) {

            var ref = database.ref('/lectures/' + course.id + '/' + lecture.id);

            // Listen to changes at ref's location in db
            var iconRef = ref.on('value', function(snapshot) {
                that.setState({
                    lectureInfo: snapshot.val()
                });
            });

            this.setState({
                firebaseListener: ref,
                firebaseCallback: iconRef
            });

        }
    }

    componentWillReceiveProps(newProps) {

        // Remove old database Listener
        if (this.state.firebaseListener != undefined) {
            this.state.firebaseListener.off('value', this.state.firebaseCallback);
        }

        // Create and store new listener so it can too be removed
        var that = this;
        var newRef = database.ref('lectures/' + newProps.iconCourse.id + '/' + newProps.iconLecture.id);

        var iconRef = newRef.on('value', function(snapshot) {
            that.setState({
                lectureInfo: snapshot.val()
            });
        });

        this.setState({
            firebaseListener: newRef,
            firebaseCallback: iconRef
        });

    }

    // Destructor, removes database listener when component is unmounted
    componentWillUnmount() {
        //Remove the database listener
        if (this.state.firebaseListener != undefined) {
            this.state.firebaseListener.off('value', this.state.firebaseCallback);
        }
    }

    render() {

        // If lecture info not loaded from DB just chill out
        if (this.state.lectureInfo == undefined) {
            return (<div></div>);
        }

        // If there are timestamps in DB, display check mark
        if (this.state.lectureInfo.timestamps != undefined) {
            return (
                <DoneMark
                    onClick={this.props.uploadButtonOnClick}
                    iconLecture={this.props.iconLecture}/>
            );
        }

        // If there is progress in the database, display a progress pie chart
        if (this.state.lectureInfo.labelProgress != undefined) {
            return (
                <LabelingProgressChart
                    onClick={this.props.uploadButtonOnClick}
                    iconLecture={this.props.iconLecture}
                    progress={this.state.lectureInfo.labelProgress}/>
            );
        }

        // If no progress, then display upload Button
        return (
            <UploadButton
                onClick={this.props.uploadButtonOnClick}
                iconLecture={this.props.iconLecture}/>
        );
    }
}

