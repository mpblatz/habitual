// initial version of the component comes from haripo: https://github.com/haripo/react-github-contribution-calendar

import dayjs from "dayjs";
import React, { ReactElement } from "react";
import Measure, { BoundingRect } from "react-measure";
import "../../styles/index.css";

interface Props {
    weekNames?: string[];
    monthNames?: string[];
    panelColors?: string[];
    values: { [date: string]: GridData };
    until: string;
    dateFormat?: string;
    weekLabelAttributes?: any | undefined;
    monthLabelAttributes?: any | undefined;
    panelAttributes?: any | undefined;
}

interface State {
    columns: number;
    maxWidth: number;
}

export default class GridV0 extends React.Component<Props, State> {
    monthLabelHeight: number;
    weekLabelWidth: number;
    panelSize: number;
    panelMargin: number;

    constructor(props: any) {
        super(props);

        this.monthLabelHeight = 15;
        this.weekLabelWidth = 15;
        this.panelSize = 11;
        this.panelMargin = 2;

        this.state = {
            columns: 53,
            maxWidth: 53,
        };
    }

    getPanelPosition(row: number, col: number) {
        const bounds = this.panelSize + this.panelMargin;
        return {
            x: this.weekLabelWidth + bounds * row,
            y: this.monthLabelHeight + bounds * col,
        };
    }

    makeCalendarData(history: { [k: string]: GridData }, lastDay: string, columns: number) {
        const d = dayjs(lastDay, { format: this.props.dateFormat });
        const lastWeekend = d.endOf("week");
        const endDate = d.endOf("day");

        var result: ({ date: string; value: number; month: number; habits: string[] } | null)[][] = [];
        for (var i = 0; i < columns; i++) {
            result[i] = [];
            for (var j = 0; j < 7; j++) {
                var date = lastWeekend.subtract((columns - i - 1) * 7 + (6 - j), "day");
                if (date <= endDate) {
                    result[i][j] = {
                        date: date.format(this.props.dateFormat),
                        value: history[date.format(this.props.dateFormat)]
                            ? history[date.format(this.props.dateFormat)].value
                            : 0,
                        month: date.month(),
                        habits: history[date.format(this.props.dateFormat)]
                            ? history[date.format(this.props.dateFormat)].habits
                            : [],
                    };
                } else {
                    result[i][j] = null;
                }
            }
        }
        return result;
    }

    showTooltip(event: React.MouseEvent<SVGRectElement, MouseEvent>, date: string, habits: string[]) {
        const target = event.target as Element | null;
        if (target instanceof Element) {
            const rect = target.getBoundingClientRect();

            const popup = document.createElement("div");
            popup.classList.add("tooltip");
            popup.style.left = `${rect.left + 10}px`;
            popup.style.top = `${rect.top + 10}px`;

            // Create and append date element
            const dateElement = document.createElement("div");
            dateElement.textContent = `${date}`;
            popup.appendChild(dateElement);

            // Check if habits array exists and render each habit on a separate line
            if (habits && habits.length > 0) {
                const habitsList = document.createElement("ul");
                habits.forEach((habit) => {
                    const habitItem = document.createElement("li");
                    habitItem.textContent = habit;
                    habitsList.appendChild(habitItem);
                });
                popup.appendChild(habitsList);
            } else {
                // If no habits, display a message
                const noHabits = document.createElement("div");
                noHabits.textContent = "Nothing Recorded";
                popup.appendChild(noHabits);
            }

            document.body.appendChild(popup);
        }
    }

    hideTooltip() {
        const popup = document.querySelector(".tooltip");
        if (popup) {
            document.body.removeChild(popup);
        }
    }

    render() {
        const columns = this.state.columns;
        const values = this.props.values;
        const until = this.props.until;

        // TODO: More sophisticated typing
        if (
            this.props.panelColors == undefined ||
            this.props.weekNames == undefined ||
            this.props.monthNames == undefined
        ) {
            return;
        }

        var contributions = this.makeCalendarData(values, until, columns);
        var innerDom: ReactElement[] = [];

        // panels
        for (var i = 0; i < columns; i++) {
            for (var j = 0; j < 7; j++) {
                var contribution = contributions[i][j];
                if (contribution === null) continue;
                const pos = this.getPanelPosition(i, j);
                const numOfColors = this.props.panelColors.length;
                const color =
                    contribution.value >= numOfColors
                        ? this.props.panelColors[numOfColors - 1]
                        : this.props.panelColors[contribution.value];
                const date = contribution.date;
                const habits = contribution.habits;
                const dom = (
                    <rect
                        key={"panel_key_" + i + "_" + j}
                        x={pos.x}
                        y={pos.y}
                        width={this.panelSize}
                        height={this.panelSize}
                        fill={color}
                        onMouseEnter={(event) => this.showTooltip(event, date, habits)}
                        onMouseLeave={this.hideTooltip}
                        {...this.props.panelAttributes}
                    ></rect>
                );
                innerDom.push(dom);
            }
        }

        // week texts
        for (var i = 0; i < this.props.weekNames.length; i++) {
            const textBasePos = this.getPanelPosition(0, i);
            const dom = (
                <text
                    key={"week_key_" + i}
                    style={{
                        fontSize: 9,
                        alignmentBaseline: "central",
                        fill: "#AAA",
                    }}
                    x={textBasePos.x - this.panelSize / 2 - 2}
                    y={textBasePos.y + this.panelSize / 2}
                    textAnchor={"middle"}
                    {...this.props.weekLabelAttributes}
                >
                    {this.props.weekNames[i]}
                </text>
            );
            innerDom.push(dom);
        }

        // month texts
        var prevMonth = -1;
        for (var i = 0; i < columns; i++) {
            const c = contributions[i][0];
            if (c === null) continue;
            if (columns > 1 && i == 0 && c.month != contributions[i + 1][0]?.month) {
                // skip first month name to avoid text overlap
                continue;
            }
            if (c.month != prevMonth) {
                var textBasePos = this.getPanelPosition(i, 0);
                innerDom.push(
                    <text
                        key={"month_key_" + i}
                        style={{
                            fontSize: 10,
                            alignmentBaseline: "central",
                            fill: "#AAA",
                        }}
                        x={textBasePos.x + this.panelSize / 2}
                        y={textBasePos.y - this.panelSize / 2 - 2}
                        textAnchor={"middle"}
                        {...this.props.monthLabelAttributes}
                    >
                        {this.props.monthNames[c.month]}
                    </text>
                );
            }
            prevMonth = c.month;
        }

        return (
            <Measure bounds onResize={(rect) => this.updateSize(rect.bounds)}>
                {({ measureRef }: any) => (
                    <div ref={measureRef} style={{ width: "100%" }}>
                        <svg
                            style={{
                                fontFamily: "Geologica, sans-serif",
                                width: "100%",
                            }}
                            height="110"
                        >
                            {innerDom}
                        </svg>
                    </div>
                )}
            </Measure>
        );
    }

    updateSize(size?: BoundingRect) {
        if (!size) return;

        const visibleWeeks = Math.floor((size.width - this.weekLabelWidth) / 13);
        this.setState({
            columns: Math.min(visibleWeeks, this.state.maxWidth),
        });
    }
}

// @ts-ignore
GridV0.defaultProps = {
    weekNames: ["", "M", "", "W", "", "F", ""],
    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    panelColors: ["#EEE", "#CCC9F7", "#9894F0", "#4942E4"],
    dateFormat: "MM-DD-YYYY",
};
