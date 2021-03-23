import { CollectionViewer } from "@angular/cdk/collections";
import { DataSource } from "@angular/cdk/table";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { Lesson } from "../model/lesson";
import { CoursesService } from "./courses.service";

export class LessonsDataSourche implements DataSource<Lesson> {
  private lessonsSubject$ = new BehaviorSubject<Lesson[]>([]);

  private loadingLessons$ = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingLessons$.asObservable();

  constructor(private coursesService: CoursesService){}

  loadLessons(courseId:number, filter:string, sortOrder:string, pageNumber:number,pageSize: number){
    this.loadingLessons$.next(true);
    this.coursesService.findLessons(courseId,filter,sortOrder,pageNumber,pageSize)
    .pipe(
      catchError(()=> of([])),
      finalize(()=>this.loadingLessons$.next(false))
    )
    .subscribe(lessons=> this.lessonsSubject$.next(lessons));
  }

  connect(collectionViewer: CollectionViewer): Observable<Lesson[] | readonly Lesson[]> {
   return this.lessonsSubject$.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.lessonsSubject$.complete();
    this.loadingLessons$.complete();
  }


}
