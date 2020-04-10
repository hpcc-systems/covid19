import React, {useEffect} from "react";

import {Badge, Button, Col, Collapse, Descriptions, Layout, PageHeader, Popover, Row, Table} from "antd";


import {Space} from "antd/es";
import {QueryData} from "../components/QueryData";
import GroupChart from "../components/GroupChart";
import {FilterRenderer} from "../components/FilterRenderer";

const {Panel} = Collapse


interface AllMetricsProps {
    title: string;
    description: string;
    typeFilter: string; //By states, world or counties
}

export default function AllMetrics(props: AllMetricsProps) {
    const [query] = React.useState<QueryData>(new QueryData('hpccsystems_covid19_query_all_metrics'));
    const [locationsMeasuresData, setLocationsMeasuresData] = React.useState<any>([]);
    const [allMeasuresData, setAllMeasuresData] = React.useState<any>([]);
    const [locationsFilter, setLocationsFilter] = React.useState<Array<string>>([]);
    const [periodFilter, setPeriodFilter] = React.useState<string>('1');
    const [periodsCatalog, setPeriodsCatalog] = React.useState<any>([]);
    const [locationsCatalog, setLocationsCatalog] = React.useState<any>([]);
    const [dataLoadingStatus, setDataLoadingStatus] = React.useState<boolean>(false);


    function toLocationsFilter(data: any) {
        let a: string[] = [];
        if (data) {
            data.forEach((item: any) => {
                a.push(item.location);
            })
        }
        return a;
    }

    useEffect(() => {
        //This will be called once. Maybe fetch the catalog info and defaults here
        let filters: Map<string, string> = new Map();
        filters.set('typeFilter', props.typeFilter);

        query.initData(filters).then(() => {
            setAllMeasuresData(query.getData('measures_by_all'));
            setPeriodsCatalog(query.getData('catalog_periods'));
            setLocationsCatalog(query.getData('catalog_locations'));
            setLocationsFilter(toLocationsFilter(query.getData('default_locations')));
        });
    }, []);


    useEffect(() => {
        let filters: Map<string, string> = new Map();
        filters.set('periodFilter', periodFilter);
        filters.set('locationsFilter', stringArrayToString(locationsFilter));
        filters.set('typeFilter', props.typeFilter);
        setDataLoadingStatus(true);
        query.initData(filters).then(() => {
            setLocationsMeasuresData(query.getData('measures_by_locations'));
            setDataLoadingStatus(false);
        });

    }, [locationsFilter, periodFilter])

    const updateLocationsFilter = (value: any) => {
        if (value) {
            setLocationsFilter(value.toString().split(','))
        } else {
            setLocationsFilter([]);
        }
    }


    const stringArrayToString = (value: string[]) => {
        let rslt = '';
        if (value) {
            value.forEach((item) => {
                if (rslt === '') {
                    rslt = item;
                } else {
                    rslt = rslt + ',' + item;
                }
            });
        }
        return rslt;
    }

    const layout = [
        {
            title: 'State',
            dataIndex: 'location',
        },
        {
            title: 'Heat Index',
            dataIndex: 'heatindex',
            // @ts-ignore
            sorter: (a, b) => a.heatindex - b.heatindex
        },
        {
            title: 'Weeks To Peak',
            dataIndex: 'weekstopeak',
            // @ts-ignore
            sorter: (a, b) => a.weekstopeak - b.weekstopeak
        },
        {
            title: 'Cases',
            dataIndex: 'cases',
            // @ts-ignore
            sorter: (a, b) => a.cases - b.cases
        },
        {
            title: 'Deaths',
            dataIndex: 'deaths',
            // @ts-ignore
            sorter: (a, b) => a.deaths - b.deaths

        },

        {
            title: 'New Cases',
            dataIndex: 'newcases',
            // @ts-ignore
            sorter: (a, b) => a.newcases - b.newcases

        },
        {
            title: 'New Deaths',
            dataIndex: 'newdeaths',
            // @ts-ignore
            sorter: (a, b) => a.newdeaths - b.newdeaths
        },
        {
            title: 'Recovered',
            dataIndex: 'recovered',
            // @ts-ignore
            sorter: (a, b) => a.recovered - b.recovered
        },
        {
            title: 'cR',
            dataIndex: 'cr',
            // @ts-ignore
            sorter: (a, b) => a.cr - b.cr
        },
        {
            title: 'mR',
            dataIndex: 'mr',
            // @ts-ignore
            sorter: (a, b) => a.mr - b.mr

        },
        {
            title: 'sdIndicator',
            dataIndex: 'sdindicator',
            // @ts-ignore
            sorter: (a, b) => a.sdindicator - b.sdindicator
        },
        {
            title: 'medIndicator',
            dataIndex: 'medindicator',
            // @ts-ignore
            sorter: (a, b) => a.dmr - b.dmr
        },
        {
            title: 'iMort',
            dataIndex: 'imort',
            // @ts-ignore
            sorter: (a, b) => a.imort - b.imort

        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            updateLocationsFilter(selectedRowKeys);
        },
        selectedRowKeys: locationsFilter,

    };

    const renderChart = () => {

            return <GroupChart title={''}
                               groupField={'measure'}
                               yField={'value'}
                               xField={'location'}
                               height={'600px'}
                               data={locationsMeasuresData}/>

    }

    const definitions = (
        <div style={{width:500}}>
        <Descriptions  column={1}>
            <Descriptions.Item label="cR">
                Compound growth factor for Confirmed Cases. This is an indicator of the degree of spread and
                should decrease with social distancing. In the absence of immunity and social mitigation's,
                this would be equal to R0 (the natural spread rate of a virus).
            </Descriptions.Item>
            <Descriptions.Item label="mR">
                Compound growth rate for Deaths. Though this lags the cR, it may be a better proxy for
                actual number of cases because it is not confounded by test availability and policy.
            </Descriptions.Item>
            <Descriptions.Item label="sdIndicator">
                Shows progress in social distancing behavior from period to period. Positive values indicate
                progress in slowing the spread. Negative values indicate that the rate of spread is
                increasing.

            </Descriptions.Item>
            <Descriptions.Item label="medIndicator">
                Shows progress in medical performance from period to period. Positive values indicate
                improvement. Negative values may indicate overload conditions. A negative value early on in
                a
                given location’s progress may indicate a lack of testing or diagnosis. A return to negative
                later in the cycle can indicate an erosion in the quality of medical care.
            </Descriptions.Item>

            <Descriptions.Item label="iMort">
                This is an approximation of Infection Mortality which is the likelihood that someone who
                tests positive for the infection will die as a result of the infection. This number may be
                exaggerated during the very early stages of the infection in a location due to lack of
                diagnosis and testing.
            </Descriptions.Item>
            <Descriptions.Item label="HeatIndex">
                This is a composite indicator designed to reflect a broad aspect of a location’s progress.
                Higher values indicate locations with higher risk. This indicator combines Case Growth (cR),
                Mortality Growth (mR), Social Distancing (sdIndicator) and Medical Indicator (medIndicator).
                This indicator is designed to flag locations that are in need of attention, due to high
                rates of
                spread or that have begun to regress (e.g. as a result of loosened social distancing or
                medical
                overload).
            </Descriptions.Item>
        </Descriptions>
        </div>
    );

    return (

        <Layout style={{padding: '20px', height: '100%'}}>

            <PageHeader title={props.title} subTitle={props.description}
            >

            </PageHeader>


            <Space direction={'vertical'}>

                <FilterRenderer title={'Select a Period'} data={periodsCatalog} value={periodFilter} mode={undefined}
                                onFilterChange={(value) => setPeriodFilter(value)}/>

                <FilterRenderer title={'Select Locations'} data={locationsCatalog} value={locationsFilter}
                                mode={"multiple"} onFilterChange={(value) => updateLocationsFilter(value)}/>

                <Table rowKey={'location'} bordered columns={layout} dataSource={allMeasuresData} loading={{spinning:dataLoadingStatus}}
                       pagination={false} scroll={{y: 500}} rowSelection={{
                    type: "checkbox" as "checkbox",
                    ...rowSelection
                }}/>

                <div style={{height:20}}/>

                <Space direction={'horizontal'}>
                    <div>Quick Select, Render chart by:</div>
                    <Button type="primary"
                            onClick={() => setLocationsFilter(toLocationsFilter(query.getData('default_locations')))}>
                        Top 10 Locations by Heat Index
                    </Button>

                    <Button type="primary"
                    >
                        Locations by Heat Index 1-2
                    </Button>

                    <Button type="primary"
                    >
                        Locations by Heat Index 0-1
                    </Button>
                </Space>

                <div style={{height:20}}/>

                <Popover placement="rightTop"  title={'Metrics Definitions'} content={definitions} trigger="click" style={{width:300}}>
                    <Button>Metrics Definitions</Button>
                </Popover>

                <div style={{height:20}}/>

                {renderChart()}




            </Space>
        </Layout>
    )


}

