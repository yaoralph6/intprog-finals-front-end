import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts: Account[] = [];
    filteredAccounts: Account[] = [];
    paginatedAccounts: Account[] = [];
    searchText: string = '';
    currentPage: number = 1;
    pageSize: number = 6; // accounts per page
    totalPages: number;
    Math: any = Math;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => {
                this.accounts = accounts;
                this.filteredAccounts = accounts;
                this.calculateTotalPages();
                this.updatePaginatedAccounts();
            });
    }

    filterAccounts() {
        this.filteredAccounts = this.searchText ? this.applyFilter() : this.accounts;
        this.currentPage = 1;
        this.calculateTotalPages();
        this.updatePaginatedAccounts();
    }
    

    private applyFilter(): Account[] {
        const lowerCaseSearch = this.searchText.toLowerCase();
        return this.accounts.filter(account =>
            `${account.title} ${account.firstName} ${account.lastName}`.toLowerCase().includes(lowerCaseSearch) ||
            account.email.toLowerCase().includes(lowerCaseSearch) ||
            account.role.toLowerCase().includes(lowerCaseSearch)
        );
    }

    calculateTotalPages() {
        this.totalPages = Math.ceil(this.filteredAccounts.length / this.pageSize);
        console.log('Total pages:', this.totalPages);
    }
    

    updatePaginatedAccounts() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        console.log(`Slicing from ${startIndex} to ${endIndex} (page: ${this.currentPage})`);
        this.paginatedAccounts = this.filteredAccounts.slice(startIndex, endIndex);
        console.log('Paginated Accounts:', this.paginatedAccounts);
    }
    

    goToPage(n: number): void {
        if (n < 1 || n > this.totalPages) {
            console.error('Attempted to access an invalid page:', n);
            return; 
        }
        this.currentPage = n;
        this.updatePaginatedAccounts();
    }
    
}
