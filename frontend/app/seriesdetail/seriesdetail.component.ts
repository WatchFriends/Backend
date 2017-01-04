import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from '../services';

import { Series } from '../model/series';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    templateUrl: './seriesdetail.component.html'
})

export class SeriesDetailComponent implements OnInit {
    series: Series;
    id: number;

    constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.id = +params['id'];
        })
    }

    ngOnInit() {
        this.loadSeries();
    }

    loadSeries() {
        this.api.getSeries(this.id)
            .subscribe(
            (series: Series) => this.series = series,
            console.error
            );
    }
}