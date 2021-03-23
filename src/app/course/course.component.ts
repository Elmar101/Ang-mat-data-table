import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, timeout} from 'rxjs/operators';
import {merge, fromEvent} from "rxjs";
import { MatTableDataSource } from '@angular/material/table';
import { LessonsDataSourche } from '../services/lessonsdatasourch.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course:Course;
    dataSource : LessonsDataSourche;
    displayedColumns = ["seqNo", "description", "duration"];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild('searce') searce: ElementRef;

    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {

    }

    ngOnInit() {

        this.course = this.route.snapshot.data["course"];

        this.dataSource = new LessonsDataSourche(this.coursesService);
    }

    ngAfterViewInit() {

      fromEvent(this.searce.nativeElement,'input')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap( () => {
          this.paginator.pageIndex = 0;
          this.loadLessonsPage();
        })
      ).subscribe();

      this.sort.sortChange.subscribe( ()=> this.paginator.pageIndex = 0);
      // this.sort.sortChange.pipe(tap( ()=>this.paginator.pageIndex = 0 )).subscribe()

      merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith([]),
        tap(()=>{
          this.loadLessonsPage();
        })
      )
      .subscribe( );
    }

    loadLessonsPage(){
      this.dataSource.loadLessons (
        this.course.id,
        this.searce.nativeElement.value,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize
      )
    }

}
