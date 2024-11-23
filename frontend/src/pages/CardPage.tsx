import PageTitle from '../components/HomePage/PageTitle';
import LoggedInName from '../components/LoggedInName';
import CardUI from '../components/Dashboard/CardUI';
const CardPage = () => {
    return (
        <div>
            <PageTitle />
            <LoggedInName />
            <CardUI />
        </div>
    );
}
export default CardPage;